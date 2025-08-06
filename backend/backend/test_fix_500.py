#!/usr/bin/env python
"""
Test script to verify the 500 error is fixed
"""
import os
import sys
import django
import requests
import json

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

def test_api_endpoints():
    """Test the API endpoints to make sure 500 error is fixed"""
    base_url = "http://127.0.0.1:8000"
    
    print("🧪 Testing API endpoints after 500 error fix...")
    
    # Test 1: Login endpoint
    print("\n1️⃣ Testing login endpoint...")
    login_data = {
        "email": "medabdelhedi@yahoo.fr",
        "password": "hama"  # Update with your actual password
    }
    
    try:
        response = requests.post(f"{base_url}/api/auth/login/", 
                               json=login_data,
                               headers={"Content-Type": "application/json"})
        
        print(f"   Status Code: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Login successful!")
            data = response.json()
            access_token = data.get('access')
            print(f"   📝 Got access token: {access_token[:50]}...")
            
            # Test 2: Protected endpoint (TestResults)
            print("\n2️⃣ Testing protected TestResults endpoint...")
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            # Test creating a TestResult
            test_data = {
                "test_name": "500 Error Fix Test",
                "status": "PASSED", 
                "details": "Testing that 500 error is fixed with proper User model"
            }
            
            create_response = requests.post(f"{base_url}/api/testresults/", 
                                          json=test_data,
                                          headers=headers)
            
            print(f"   Status Code: {create_response.status_code}")
            if create_response.status_code == 201:
                print("   ✅ TestResult creation successful!")
                result_data = create_response.json()
                print(f"   📝 Created TestResult ID: {result_data.get('id')}")
                print(f"   👤 Uploaded by: {result_data.get('uploaded_by', {}).get('full_name')}")
                
                # Test 3: Get all TestResults
                print("\n3️⃣ Testing GET TestResults endpoint...")
                get_response = requests.get(f"{base_url}/api/testresults/", headers=headers)
                print(f"   Status Code: {get_response.status_code}")
                if get_response.status_code == 200:
                    print("   ✅ GET TestResults successful!")
                    results = get_response.json()
                    print(f"   📊 Total results: {results.get('count', 0)}")
                else:
                    print(f"   ❌ GET failed: {get_response.text[:200]}")
                    
            else:
                print(f"   ❌ TestResult creation failed: {create_response.text[:200]}")
                
        else:
            print(f"   ❌ Login failed: {response.text[:200]}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Cannot connect to server. Make sure Django server is running on port 8000")
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")

if __name__ == "__main__":
    test_api_endpoints()
    print("\n🎯 Test completed!")
