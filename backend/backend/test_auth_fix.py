#!/usr/bin/env python
"""
Quick test script to verify JWT authentication with TestResult creation
"""
import os
import django
import sys

# Add the backend directory to the Python path
sys.path.append('C:/Users/lenovo/Desktop/Internship25/react-django/backend')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from accounts.models import User
from testresults.models import TestResult
from rest_framework_simplejwt.tokens import RefreshToken

def test_jwt_authentication():
    print("🔧 Testing JWT Authentication for TestResult Creation")
    print("=" * 60)
    
    # Get or create a test user
    try:
        user = User.objects.get(email='medabdelhedi@yahoo.fr')
        print(f"✅ Found existing user: {user.email}")
    except User.DoesNotExist:
        print("❌ Superuser not found. Please create one first.")
        return
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    
    print(f"🔑 Generated JWT Access Token: {access_token[:50]}...")
    
    # Test creating a TestResult directly (simulating API call)
    try:
        test_result = TestResult.objects.create(
            test_name="JWT Authentication Test",
            status="PASSED",
            details="Testing JWT authentication with direct model creation",
            uploaded_by=user
        )
        print(f"✅ TestResult created successfully!")
        print(f"   ID: {test_result.id}")
        print(f"   Test Name: {test_result.test_name}")
        print(f"   Status: {test_result.status}")
        print(f"   Uploaded By: {test_result.uploaded_by.email}")
        print(f"   Executed At: {test_result.executed_at}")
        
    except Exception as e:
        print(f"❌ Error creating TestResult: {e}")
        return
    
    print("\n🎯 Next Steps:")
    print("1. Start your Django server: .\env\Scripts\python.exe manage.py runserver 8000")
    print("2. Use this access token in Postman:")
    print(f"   Authorization: Bearer {access_token}")
    print("3. POST to: http://127.0.0.1:8000/api/testresults/")
    print("4. Body: {\"test_name\": \"API Test\", \"status\": \"PASSED\", \"details\": \"Testing via API\"}")

if __name__ == "__main__":
    test_jwt_authentication()
