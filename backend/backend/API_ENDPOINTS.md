# JWT Authentication API Endpoints

## Base URL: http://127.0.0.1:8000

## Authentication Endpoints:

### 1. User Registration
- **URL:** `POST http://127.0.0.1:8000/api/auth/register/`
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

### 2. User Login
- **URL:** `POST http://127.0.0.1:8000/api/auth/login/`
- **Body (JSON):**
```json
{
    "email": "test@example.com",
    "password": "testpassword123"
}
```

### 3. User Profile (Protected)
- **URL:** `GET http://127.0.0.1:8000/api/auth/profile/`
- **Headers:** `Authorization: Bearer <your_access_token>`

### 4. Change Password (Protected)
- **URL:** `POST http://127.0.0.1:8000/api/auth/change-password/`
- **Headers:** `Authorization: Bearer <your_access_token>`
- **Body (JSON):**
```json
{
    "old_password": "oldpassword123",
    "new_password": "newpassword123",
    "new_password_confirm": "newpassword123"
}
```

### 5. Refresh Token
- **URL:** `POST http://127.0.0.1:8000/api/auth/token/refresh/`
- **Body (JSON):**
```json
{
    "refresh": "<your_refresh_token>"
}
```

### 6. Logout (Protected)
- **URL:** `POST http://127.0.0.1:8000/api/auth/logout/`
- **Headers:** `Authorization: Bearer <your_access_token>`
- **Body (JSON):**
```json
{
    "refresh": "<your_refresh_token>"
}
```

## TestResults Endpoints (Protected):

### 1. List TestResults
- **URL:** `GET http://127.0.0.1:8000/api/testresults/`
- **Headers:** `Authorization: Bearer <your_access_token>`

### 2. Create TestResult
- **URL:** `POST http://127.0.0.1:8000/api/testresults/`
- **Headers:** `Authorization: Bearer <your_access_token>`
- **Body (JSON):**
```json
{
    "test_name": "My Test",
    "status": "PASSED",
    "details": "Test completed successfully"
}
```

### 3. Get Statistics
- **URL:** `GET http://127.0.0.1:8000/api/testresults/statistics/`
- **Headers:** `Authorization: Bearer <your_access_token>`

## Quick Test URLs to Try:

1. **Registration:** http://127.0.0.1:8000/api/auth/register/
2. **Login:** http://127.0.0.1:8000/api/auth/login/
3. **TestResults:** http://127.0.0.1:8000/api/testresults/
4. **Admin:** http://127.0.0.1:8000/admin/

Note: The URLs must end with a trailing slash `/`
