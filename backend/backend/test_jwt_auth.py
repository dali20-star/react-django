#!/usr/bin/env python
"""
Test script for JWT Authentication API endpoints
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_user_registration():
    """Test user registration endpoint"""
    print("=== Testing User Registration ===")
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "phone_number": "+1234567890",
        "password": "testpassword123",
        "password_confirm": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register/", json=data)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 201:
            result = response.json()
            print("✅ Registration successful!")
            print(f"User ID: {result['user']['id']}")
            print(f"Access Token: {result['access'][:50]}...")
            return result['access'], result['refresh']
        else:
            print(f"❌ Registration failed: {response.text}")
            return None, None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None, None

def test_user_login():
    """Test user login endpoint"""
    print("\n=== Testing User Login ===")
    data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=data)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("✅ Login successful!")
            print(f"User: {result['user']['first_name']} {result['user']['last_name']}")
            print(f"Access Token: {result['access'][:50]}...")
            return result['access'], result['refresh']
        else:
            print(f"❌ Login failed: {response.text}")
            return None, None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None, None

def test_protected_endpoint(access_token):
    """Test accessing protected user profile endpoint"""
    print("\n=== Testing Protected Profile Endpoint ===")
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/auth/profile/", headers=headers)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print("✅ Profile access successful!")
            print(f"User: {result['first_name']} {result['last_name']}")
            print(f"Email: {result['email']}")
            return True
        else:
            print(f"❌ Profile access failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_testresults_api(access_token):
    """Test creating a test result with authentication"""
    print("\n=== Testing TestResults API with Authentication ===")
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {
        "test_name": "JWT Auth Test",
        "status": "PASSED",
        "details": "Testing JWT authentication with TestResults API"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/testresults/", json=data, headers=headers)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 201:
            result = response.json()
            print("✅ TestResult created successfully!")
            print(f"Test Result ID: {result['id']}")
            print(f"Uploaded by: {result['uploaded_by']['first_name']} {result['uploaded_by']['last_name']}")
            return True
        else:
            print(f"❌ TestResult creation failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting JWT Authentication API Tests")
    print("=" * 50)
    
    # Test registration
    access_token, refresh_token = test_user_registration()
    
    if not access_token:
        # If registration fails, try login (user might already exist)
        access_token, refresh_token = test_user_login()
    
    if access_token:
        # Test protected endpoints
        test_protected_endpoint(access_token)
        test_testresults_api(access_token)
        
        print("\n🎉 All tests completed!")
    else:
        print("\n❌ Cannot proceed without valid authentication")

if __name__ == "__main__":
    main()
