import os
import unittest
from fastapi.testclient import TestClient
from main import app

class AnalysisTests(unittest.TestCase):
    def setUp(self):
        os.environ['AI_SERVICE_SECRET'] = 'test-service-key'
        self.client = TestClient(app)
        self.headers = {'X-Service-Key': 'test-service-key'}

    def upload(self, csv):
        return self.client.post('/upload-csv', headers=self.headers,
                                files={'file': ('data.csv', csv, 'text/csv')})

    def test_service_requires_key(self):
        response = self.client.post('/upload-csv', files={'file': ('x.csv', b'date,amount\n', 'text/csv')})
        self.assertEqual(response.status_code, 401)

    def test_upload_is_stateless_and_includes_zero_income_month(self):
        first = self.upload(b'date,amount,type\n2025-01-01,100,INCOME\n2025-03-01,300,INCOME\n')
        self.assertEqual(first.status_code, 200)
        self.assertEqual(first.json()['dashboard']['forecast_series'], [100, 0, 300])
        second = self.upload(b'date,amount,type\n2025-01-01,42,INCOME\n')
        self.assertEqual(second.status_code, 200)
        self.assertEqual(len(second.json()['transactions']), 1)
        self.assertEqual(second.json()['transactions'][0]['amount'], 42)
        self.assertEqual(self.client.get('/transactions', headers=self.headers).status_code, 404)

    def test_description_is_not_a_credit_column(self):
        response = self.upload(b'date,description,amount,type\n2025-01-01,subscription,25,EXPENSE\n')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['transactions'][0]['type'], 'EXPENSE')

    def test_unknown_transaction_type_is_rejected(self):
        response = self.upload(b'date,amount,type\n2025-01-01,100,unknown\n')
        self.assertEqual(response.status_code, 400)

    def test_unsigned_amount_without_type_is_rejected(self):
        response = self.upload(b'date,amount\n2025-01-01,100\n')
        self.assertEqual(response.status_code, 400)

    def test_invalid_date_is_rejected(self):
        response = self.upload(b'date,amount,type\nnot-a-date,100,INCOME\n')
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()
