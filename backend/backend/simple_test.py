import requests
import json

def test_api():
    """Simple test without Django imports"""
    base_url = "http://127.0.0.1:8000"
    
    print("🧪 Testing API after 500 error fix...")
    
    # Test login
    print("\n1️⃣ Testing login...")
    login_data = {
        "email": "medabdelhedi@yahoo.fr",
        "password": "hamahama123"  # Use the correct password
    }
    
    try:
        response = requests.post(f"{base_url}/api/auth/login/", json=login_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Login successful!")
            data = response.json()
            token = data.get('access')
            print(f"   Token: {token[:50]}...")
            
            # Test creating TestResult
            print("\n2️⃣ Testing TestResult creation...")
            headers = {"Authorization": f"Bearer {token}"}
            test_data = {
                "test_name": "500 Error Fix Test",
                "status": "PASSED",
                "details": "Testing the serializer fix"
            }
            
            create_response = requests.post(f"{base_url}/api/testresults/", 
                                          json=test_data, headers=headers)
            print(f"   Status: {create_response.status_code}")
            
            if create_response.status_code == 201:
                print("   ✅ TestResult created successfully!")
                result = create_response.json()
                print(f"   ID: {result.get('id')}")
                print(f"   User: {result.get('uploaded_by', {}).get('full_name')}")
            else:
                print(f"   ❌ Failed: {create_response.text}")
                
        else:
            print(f"   ❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_api()
