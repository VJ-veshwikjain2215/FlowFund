"""Exercise CSV analysis with real pandas/NumPy and stubbed web plumbing.

This supplements, but does not replace, test_analysis.py's HTTP tests.
"""
import asyncio
import importlib.util
import io
import pathlib
import sys
import types
import unittest


class HTTPException(Exception):
    def __init__(self, status_code, detail):
        self.status_code = status_code
        self.detail = detail


class FakeApp:
    def __init__(self, **kwargs):
        pass

    def middleware(self, *args, **kwargs):
        return lambda fn: fn

    def post(self, *args, **kwargs):
        return lambda fn: fn


class FakeUpload:
    def __init__(self, data):
        self.stream = io.BytesIO(data)

    async def read(self, size=-1):
        return self.stream.read(size)


def load_analysis():
    fastapi = types.ModuleType("fastapi")
    fastapi.FastAPI = FakeApp
    fastapi.HTTPException = HTTPException
    fastapi.UploadFile = FakeUpload
    fastapi.File = lambda *args, **kwargs: None
    fastapi.Request = object
    middleware = types.ModuleType("fastapi.middleware")
    cors = types.ModuleType("fastapi.middleware.cors")
    cors.CORSMiddleware = object
    responses = types.ModuleType("fastapi.responses")
    responses.JSONResponse = object
    modules = {"fastapi": fastapi, "fastapi.middleware": middleware,
               "fastapi.middleware.cors": cors, "fastapi.responses": responses,
               "uvicorn": types.ModuleType("uvicorn")}
    spec = importlib.util.spec_from_file_location("analysis_offline", pathlib.Path(__file__).with_name("main.py"))
    module = importlib.util.module_from_spec(spec)
    old = {name: sys.modules.get(name) for name in modules}
    try:
        sys.modules.update(modules)
        spec.loader.exec_module(module)
    finally:
        for name, previous in old.items():
            if previous is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = previous
    return module


class ImportTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.service = load_analysis()

    def upload(self, data):
        return asyncio.run(self.service.upload_csv(FakeUpload(data)))

    def test_zero_income_month_and_independent_uploads(self):
        first = self.upload(b"date,amount,type\n2025-01-01,100,INCOME\n2025-03-01,300,INCOME\n")
        second = self.upload(b"date,amount,type\n2025-01-01,42,INCOME\n")
        self.assertEqual(first["dashboard"]["forecast_series"], [100, 0, 300])
        self.assertEqual(second["transactions"][0]["amount"], 42)
        self.assertEqual(len(first["transactions"]), 2)

    def test_description_is_not_credit_column(self):
        result = self.upload(b"date,description,amount,type\n2025-01-01,subscription,25,EXPENSE\n")
        self.assertEqual(result["transactions"][0]["type"], "EXPENSE")

    def test_invalid_data_is_rejected(self):
        for data in (b"date,amount\n2025-01-01,100\n",
                     b"date,amount,type\nnot-a-date,100,INCOME\n",
                     b"date,amount,type\n2025-01-01,100,unknown\n"):
            with self.subTest(data=data), self.assertRaises(HTTPException) as error:
                self.upload(data)
            self.assertEqual(error.exception.status_code, 400)


if __name__ == "__main__":
    unittest.main()
