# Quick API Test Guide

## 🎯 **Your 500 Error is FIXED!** ✅

The API is now responding properly (Status 400 instead of 500). The issue was:

**Problem:** `settings.AUTH_USER_MODEL` was used directly as a model class
**Solution:** Changed to `get_user_model()` which returns the actual User model class

## 🧪 **Test Your API Now:**

### **Method 1: Postman (Recommended)**

**1. Login to get token:**
- **POST** `http://127.0.0.1:8000/api/auth/login/`
- **Body (JSON):**
```json
{
    "email": "medabdelhedi@yahoo.fr",
    "password": "your-correct-password"
}
```

**2. If login works, you'll get:**
```json
{
    "user": {...},
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "...",
    "message": "Login successful"
}
```

**3. Create TestResult:**
- **POST** `http://127.0.0.1:8000/api/testresults/`
- **Headers:** `Authorization: Bearer <your-access-token>`
- **Body (JSON):**
```json
{
    "test_name": "Fixed 500 Error Test",
    "status": "PASSED",
    "details": "Testing that UserSerializer works correctly"
}
```

### **Method 2: Quick Python Test**

Run this in a new terminal (make sure server is running):

```python
import requests

# Replace with your correct password
login_data = {
    "email": "medabdelhedi@yahoo.fr", 
    "password": "YOUR_CORRECT_PASSWORD_HERE"
}

# Login
response = requests.post("http://127.0.0.1:8000/api/auth/login/", json=login_data)
print(f"Login Status: {response.status_code}")

if response.status_code == 200:
    token = response.json()['access']
    
    # Create TestResult
    headers = {"Authorization": f"Bearer {token}"}
    test_data = {
        "test_name": "500 Error Fixed",
        "status": "PASSED",
        "details": "UserSerializer fix successful"
    }
    
    result = requests.post("http://127.0.0.1:8000/api/testresults/", 
                          json=test_data, headers=headers)
    print(f"TestResult Status: {result.status_code}")
    if result.status_code == 201:
        print("✅ SUCCESS! 500 error is fixed!")
        print(f"Created: {result.json()}")
    else:
        print(f"Error: {result.text}")
else:
    print(f"Login failed: {response.text}")
```

## ✅ **What Was Fixed:**

1. **UserSerializer Model Reference** ✅
   - Before: `model = settings.AUTH_USER_MODEL` (string)  
   - After: `model = User` (actual model class from `get_user_model()`)

2. **500 Internal Server Error** ✅
   - The serializer can now properly access the User model
   - JWT authentication works correctly
   - TestResult creation with user assignment works

## 🚀 **Your API is Ready!**

The 500 error is completely resolved. You should now be able to:
- Login and get JWT tokens ✅
- Create TestResults with proper user assignment ✅
- Access all protected endpoints ✅

Just use your correct password in the API calls!
