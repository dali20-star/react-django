# Testing JWT Authentication API with Postman

## 🚀 Complete Postman Testing Guide

### Prerequisites
1. Make sure your Django server is running: `.\env\Scripts\python.exe manage.py runserver 8000`
2. Open Postman application
3. Base URL: `http://127.0.0.1:8000`

---

## 📋 Test Sequence

### 1. **User Registration** 
#### Create a new user account

**Request:**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/auth/register/`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
      "username": "testuser",
      "email": "test@example.com",
      "first_name": "Test",
      "last_name": "User",
      "phone_number": "+1234567890",
      "password": "testpassword123",
      "password_confirm": "testpassword123"
  }
  ```

**Expected Response (201 Created):**
```json
{
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "phone_number": "+1234567890",
        "full_name": "Test User",
        "date_joined": "2025-07-15T...",
        "is_active": true
    },
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "message": "User registered successfully"
}
```

**✅ Save the `access` and `refresh` tokens for next steps!**

---

### 2. **User Login**
#### Authenticate existing user

**Request:**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/auth/login/`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
      "email": "test@example.com",
      "password": "testpassword123"
  }
  ```

**Expected Response (200 OK):**
```json
{
    "user": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "phone_number": "+1234567890",
        "full_name": "Test User",
        "date_joined": "2025-07-15T...",
        "is_active": true
    },
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "message": "Login successful"
}
```

---

### 3. **Get User Profile** (Protected Endpoint)
#### Access authenticated user's profile

**Request:**
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/auth/profile/`
- **Headers:**
  ```
  Authorization: Bearer <your_access_token_here>
  Content-Type: application/json
  ```

**Expected Response (200 OK):**
```json
{
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "phone_number": "+1234567890",
    "full_name": "Test User",
    "date_joined": "2025-07-15T...",
    "is_active": true
}
```

---

### 4. **Create Test Result** (Protected Endpoint)
#### Create a new test result

**Request:**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/testresults/`
- **Headers:**
  ```
  Authorization: Bearer <your_access_token_here>
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
      "test_name": "JWT Authentication Test",
      "status": "PASSED",
      "details": "Testing JWT authentication with Postman"
  }
  ```

**Expected Response (201 Created):**
```json
{
    "id": 1,
    "test_name": "JWT Authentication Test",
    "status": "PASSED",
    "executed_at": "2025-07-15T...",
    "details": "Testing JWT authentication with Postman",
    "test_file": null,
    "original_filename": null,
    "file_url": null,
    "file_name": null,
    "uploaded_by": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "full_name": "Test User"
    },
    "uploaded_by_id": 1
}
```

---

### 5. **Get Test Results List** (Protected Endpoint)
#### Retrieve all test results

**Request:**
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/testresults/`
- **Headers:**
  ```
  Authorization: Bearer <your_access_token_here>
  ```

**Expected Response (200 OK):**
```json
{
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "test_name": "JWT Authentication Test",
            "status": "PASSED",
            "executed_at": "2025-07-15T...",
            "details": "Testing JWT authentication with Postman",
            "test_file": null,
            "original_filename": null,
            "file_url": null,
            "file_name": null,
            "uploaded_by": {
                "id": 1,
                "username": "testuser",
                "email": "test@example.com",
                "first_name": "Test",
                "last_name": "User",
                "full_name": "Test User"
            },
            "uploaded_by_id": 1
        }
    ]
}
```

---

### 6. **Get Statistics** (Protected Endpoint)
#### Get test results statistics

**Request:**
- **Method:** `GET`
- **URL:** `http://127.0.0.1:8000/api/testresults/statistics/`
- **Headers:**
  ```
  Authorization: Bearer <your_access_token_here>
  ```

**Expected Response (200 OK):**
```json
{
    "total_tests": 1,
    "passed_tests": 1,
    "failed_tests": 0,
    "pending_tests": 0,
    "pass_rate": 100.0,
    "recent_tests": [
        {
            "id": 1,
            "test_name": "JWT Authentication Test",
            "status": "PASSED",
            "executed_at": "2025-07-15T..."
        }
    ]
}
```

---

### 7. **Refresh Token**
#### Get new access token using refresh token

**Request:**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/auth/token/refresh/`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
      "refresh": "<your_refresh_token_here>"
  }
  ```

**Expected Response (200 OK):**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

### 8. **Update User Profile** (Protected Endpoint)
#### Update user information

**Request:**
- **Method:** `PUT`
- **URL:** `http://127.0.0.1:8000/api/auth/profile/`
- **Headers:**
  ```
  Authorization: Bearer <your_access_token_here>
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
      "first_name": "Updated",
      "last_name": "Name",
      "phone_number": "+9876543210"
  }
  ```

---

### 9. **Change Password** (Protected Endpoint)
#### Change user password

**Request:**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/auth/change-password/`
- **Headers:**
  ```
  Authorization: Bearer <your_access_token_here>
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
      "old_password": "testpassword123",
      "new_password": "newpassword456",
      "new_password_confirm": "newpassword456"
  }
  ```

---

### 10. **Logout** (Protected Endpoint)
#### Logout and blacklist refresh token

**Request:**
- **Method:** `POST`
- **URL:** `http://127.0.0.1:8000/api/auth/logout/`
- **Headers:**
  ```
  Authorization: Bearer <your_access_token_here>
  Content-Type: application/json
  ```
- **Body (JSON):**
  ```json
  {
      "refresh": "<your_refresh_token_here>"
  }
  ```

---

## 🔧 Postman Setup Tips

### 1. **Environment Variables**
Create a Postman environment with these variables:
- `base_url`: `http://127.0.0.1:8000`
- `access_token`: (set after login)
- `refresh_token`: (set after login)

### 2. **Authorization Setup**
For protected endpoints, use:
- Type: `Bearer Token`
- Token: `{{access_token}}`

### 3. **Pre-request Scripts**
Add this to automatically set tokens after login:
```javascript
// For login/register requests
pm.test("Save tokens", function () {
    var responseJson = pm.response.json();
    if (responseJson.access) {
        pm.environment.set("access_token", responseJson.access);
    }
    if (responseJson.refresh) {
        pm.environment.set("refresh_token", responseJson.refresh);
    }
});
```

---

## ❌ Common Error Responses

### 401 Unauthorized
```json
{
    "detail": "Given token not valid for any token type",
    "code": "token_not_valid",
    "messages": [
        {
            "token_class": "AccessToken",
            "token_type": "access",
            "message": "Token is invalid or expired"
        }
    ]
}
```

### 400 Bad Request
```json
{
    "email": ["This field is required."],
    "password": ["This field is required."]
}
```

### 403 Forbidden
```json
{
    "detail": "Authentication credentials were not provided."
}
```

---

## 🎯 Testing Checklist

- [ ] ✅ User registration works
- [ ] ✅ User login returns tokens
- [ ] ✅ Protected endpoints require authentication
- [ ] ✅ Access token works for API calls
- [ ] ✅ Refresh token can renew access token
- [ ] ✅ Test results can be created/retrieved
- [ ] ✅ User profile can be accessed/updated
- [ ] ✅ Password can be changed
- [ ] ✅ Logout invalidates tokens

Your JWT authentication API is ready for production use! 🚀
