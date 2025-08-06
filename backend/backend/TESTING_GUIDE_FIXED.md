# Complete Testing Guide for JWT Authentication with TestResults

## 🎯 **Testing Steps**

### **1. Start Django Server**
```bash
cd C:\Users\lenovo\Desktop\Internship25\react-django\backend
.\env\Scripts\python.exe manage.py runserver 8000
```

### **2. Test Authentication Flow**

#### **A. Get JWT Token (Login)**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/auth/login/`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
    "email": "medabdelhedi@yahoo.fr",
    "password": "your-password"
}
```

**Expected Response:**
```json
{
    "user": {
        "id": 1,
        "username": "hamahama",
        "email": "medabdelhedi@yahoo.fr",
        "first_name": "mohamed",
        "last_name": "abdelhedi",
        "full_name": "mohamed abdelhedi"
    },
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "message": "Login successful"
}
```

**✅ Save the `access` token!**

---

#### **B. Create TestResult (Protected)**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/testresults/`
- **Headers:**
  ```
  Authorization: Bearer <your-access-token>
  Content-Type: application/json
  ```
- **Body:**
```json
{
    "test_name": "JWT Authentication Test",
    "status": "PASSED",
    "details": "Testing JWT authentication with fixed serializers"
}
```

**Expected Response:**
```json
{
    "id": 3,
    "test_name": "JWT Authentication Test",
    "status": "PASSED",
    "executed_at": "2025-08-02T...",
    "details": "Testing JWT authentication with fixed serializers",
    "test_file": null,
    "file_url": null,
    "file_name": null,
    "uploaded_by": {
        "id": 1,
        "username": "hamahama",
        "email": "medabdelhedi@yahoo.fr",
        "first_name": "mohamed",
        "last_name": "abdelhedi",
        "full_name": "mohamed abdelhedi"
    },
    "uploaded_by_id": 1
}
```

---

#### **C. Get All TestResults (Protected)**
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/testresults/`
- **Headers:** `Authorization: Bearer <your-access-token>`

**Expected Response:**
```json
{
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 3,
            "test_name": "JWT Authentication Test",
            "status": "PASSED",
            "executed_at": "2025-08-02T...",
            "details": "Testing JWT authentication with fixed serializers",
            "test_file": null,
            "file_url": null,
            "file_name": null,
            "uploaded_by": {
                "id": 1,
                "username": "hamahama",
                "email": "medabdelhedi@yahoo.fr",
                "first_name": "mohamed",
                "last_name": "abdelhedi",
                "full_name": "mohamed abdelhedi"
            },
            "uploaded_by_id": 1
        }
    ]
}
```

---

#### **D. Get Statistics (Protected)**
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/testresults/statistics/`
- **Headers:** `Authorization: Bearer <your-access-token>`

**Expected Response:**
```json
{
    "total_tests": 2,
    "passed_tests": 2,
    "failed_tests": 0,
    "pending_tests": 0,
    "skipped_tests": 0,
    "pass_rate": 100.0,
    "recent_tests": [
        {
            "id": 3,
            "test_name": "JWT Authentication Test",
            "status": "PASSED",
            "executed_at": "2025-08-02T..."
        },
        {
            "id": 2,
            "test_name": "JWT Authentication Test",
            "status": "PASSED",
            "executed_at": "2025-08-02T..."
        }
    ]
}
```

---

### **3. Test Without Token (Should Fail)**

#### **Try to Create TestResult Without Token**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/testresults/`
- **Headers:** `Content-Type: application/json` (NO Authorization header)
- **Body:** Any valid JSON

**Expected Response (401 Unauthorized):**
```json
{
    "detail": "Authentication credentials were not provided."
}
```

---

### **4. Test File Upload (Optional)**

#### **Create TestResult with File**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/testresults/`
- **Headers:** `Authorization: Bearer <your-access-token>`
- **Body:** `form-data` (not JSON)
  ```
  test_name: "File Upload Test"
  status: "PASSED"
  details: "Testing file upload with authentication"
  test_file: [select a file]
  ```

---

## 🛠 **Testing Tools**

### **Option 1: Postman (Recommended)**
1. Import the API endpoints from your `POSTMAN_TESTING_GUIDE.md`
2. Set up environment variables:
   - `base_url`: `http://127.0.0.1:8000`
   - `access_token`: (will be set after login)
3. Follow the sequence: Login → Save token → Test endpoints

### **Option 2: curl Commands**
```bash
# 1. Login and get token
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "medabdelhedi@yahoo.fr", "password": "your-password"}'

# 2. Create TestResult (replace TOKEN with actual token)
curl -X POST http://127.0.0.1:8000/api/testresults/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"test_name": "curl Test", "status": "PASSED", "details": "Testing with curl"}'
```

### **Option 3: Python Script**
```python
import requests

# Login
login_response = requests.post('http://127.0.0.1:8000/api/auth/login/', json={
    "email": "medabdelhedi@yahoo.fr",
    "password": "your-password"
})
token = login_response.json()['access']

# Create TestResult
headers = {'Authorization': f'Bearer {token}'}
test_response = requests.post('http://127.0.0.1:8000/api/testresults/', 
    headers=headers,
    json={
        "test_name": "Python Script Test",
        "status": "PASSED",
        "details": "Testing with Python requests"
    }
)
print(test_response.json())
```

---

## ✅ **What Should Work Now:**

1. **JWT Authentication Required** ✅
2. **Automatic User Assignment** ✅ 
3. **Custom User Model Integration** ✅
4. **File Upload Support** ✅
5. **Statistics with Recent Tests** ✅
6. **Proper Error Handling** ✅

## 🎯 **Quick Test Checklist:**

- [ ] Server starts without errors
- [ ] Login returns JWT tokens
- [ ] Creating TestResult with token works
- [ ] Creating TestResult without token fails (401)
- [ ] User is automatically assigned to `uploaded_by`
- [ ] Statistics endpoint works
- [ ] File upload works (optional)

Your JWT authentication with TestResults is now properly configured and ready to test! 🚀
