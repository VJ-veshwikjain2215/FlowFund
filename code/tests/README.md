# Developer checks

Automated tests stay with their services: Java tests are in [backend/src/test](../backend/src/test/), and analysis tests are in [ai-service/test_analysis.py](../ai-service/test_analysis.py).

The legacy/ directory preserves the original stress_test.py, test_dates.py, and test_sync.py scripts. They are manual development utilities, not the automated verification suite. They assume running local services and may create test accounts or records. Some use historical endpoints, ports, or machine-specific CSV paths; review and configure them before running. The structure change preserves their contents and does not validate those flows.
