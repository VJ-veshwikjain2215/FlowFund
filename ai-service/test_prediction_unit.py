"""Dependency-free checks; endpoint tests require the AI service dependencies."""
import ast
import pathlib
import statistics
import types
import unittest

source = pathlib.Path(__file__).with_name("main.py").read_text(encoding="utf-8")
tree = ast.parse(source)
functions = [node for node in tree.body if isinstance(node, ast.FunctionDef)
             and node.name in {"get_prediction", "calculate_volatility"}]
namespace = {
    "pd": types.SimpleNamespace(Series=type("UnusedSeries", (), {})),
    "np": types.SimpleNamespace(mean=statistics.mean, std=statistics.pstdev),
}
exec(compile(ast.Module(body=functions, type_ignores=[]), "main.py", "exec"), namespace)
predict = namespace["get_prediction"]
volatility = namespace["calculate_volatility"]


class PredictionTests(unittest.TestCase):
    def test_empty_and_single_month(self):
        self.assertEqual(predict([]), {"min": 0, "expected": 0, "max": 0})
        self.assertEqual(predict([100]), {"min": 95, "expected": 100, "max": 105})

    def test_zero_income_month_affects_forecast(self):
        with_gap = predict([100, 0, 100])
        without_gap = predict([100, 100, 100])
        self.assertLess(with_gap["expected"], without_gap["expected"])
        self.assertGreaterEqual(with_gap["min"], 0)
        self.assertLessEqual(with_gap["min"], with_gap["expected"])
        self.assertLessEqual(with_gap["expected"], with_gap["max"])

    def test_volatility_is_zero_for_stable_or_missing_data(self):
        self.assertEqual(volatility([]), 0)
        self.assertEqual(volatility([100, 100]), 0)
        self.assertGreater(volatility([0, 100]), 0)


if __name__ == "__main__":
    unittest.main()
