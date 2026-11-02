import requests
import json
import os
import time

BASE_URL = "http://localhost:8085/api"
CSV_PATH = "c:/Users/kunal/freelancer/flowfund/test_income.csv"

def run_test():
    print("🚀 Starting FlowFund Integration Test...")

    # 1. REGISTER TEST USER
    user_data = {
        "name": "Freelancer Test",
        "email": "test@flowfund.ai",
        "password": "securepassword123",
        "rent": 25000.00,
        "groceries": 10000.00,
        "utilities": 5000.00
    }
    
    print("\n[STEP 1] Registering User...")
    reg_res = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    token = reg_res.text
    print(f"✅ User Registered. JWT Token: {token[:50]}...")

    headers = {"Authorization": f"Bearer {token}"}

    # 2. UPLOAD CSV (TRIP THE PIPELINE)
    print("\n[STEP 2] Uploading Volatile Income CSV...")
    with open(CSV_PATH, 'rb') as f:
        files = {'file': f}
        upload_res = requests.post(f"{BASE_URL}/transactions/upload", headers=headers, files=files)
        print(f"✅ CSV Upload: {upload_res.text}")

    # Small wait for async processing if any, though PipelineService runs it
    time.sleep(2)

    # 3. GET BUFFER & SAFE SPEND
    print("\n[STEP 3] Fetching Financial Buffers...")
    buffer_res = requests.get(f"{BASE_URL}/buffer", headers=headers)
    buffer = buffer_res.json()
    print(json.dumps(buffer, indent=4))

    # 4. GET AI INSIGHTS & SURVIVAL CHECK
    print("\n[STEP 4] Retrieving AI Intelligence & Risk Profile...")
    insights_res = requests.get(f"{BASE_URL}/buffer/insights", headers=headers)
    insights = insights_res.json()
    
    print("\n✨ FLOWFUND INSIGHTS:")
    for i in insights:
        print(f"  💡 {i}")

    # 5. GET SCORE
    score_res = requests.get(f"{BASE_URL}/insights/score", headers=headers)
    print(f"\n📊 Financial Health Score: {score_res.json()['score']}/100")

    print("\n🏁 Integration Test Completed.")

if __name__ == "__main__":
    run_test()
