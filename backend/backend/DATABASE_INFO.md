# 📊 Your Database Overview

## 🗄️ **Database Location:**
**File:** `C:\Users\lenovo\Desktop\Internship25\react-django\backend\db.sqlite3`
**Type:** SQLite Database
**Size:** You can check the file size in Windows Explorer

## 📁 **Uploaded Files Location:**
**Folder:** `C:\Users\lenovo\Desktop\Internship25\react-django\backend\media\testresults\test_files\`
**Files Found:** 12 uploaded test files
- aaa.txt
- aaa_1IA6xX5.txt  ← This is the file you just uploaded!
- aaa_4uChwMJ.txt
- aaa_5JlzRDj.txt
- aaa_8nzTWz9.txt
- aaa_9wsZ0pf.txt
- aaa_EkERLye.txt
- aaa_H9Zuyph.txt
- aaa_pD48Pcd.txt
- aaa_qqioYsJ.txt
- aaa_T81ed8r.txt
- aaa_yLUWUPp.txt

## 🔍 **How to View Your Database:**

### **Method 1: Django Admin Interface**
1. Create superuser (if not already done):
   ```bash
   python manage.py createsuperuser
   ```

2. Start server and go to:
   ```
   http://127.0.0.1:8000/admin/
   ```

3. Login and you'll see:
   - **Users** (from accounts app)
   - **Test Results** (from testresults app)

### **Method 2: Django Shell**
```bash
python manage.py shell
```

Then run:
```python
from django.contrib.auth import get_user_model
from testresults.models import TestResult

User = get_user_model()

# Check users
print("=== USERS ===")
for user in User.objects.all():
    print(f"ID: {user.id}, Username: {user.username}, Email: {user.email}")

# Check test results
print("\n=== TEST RESULTS ===")
for test in TestResult.objects.all():
    print(f"ID: {test.id}, Name: {test.test_name}, Status: {test.status}")
    print(f"   File: {test.test_file}, User: {test.uploaded_by}")
    print(f"   Date: {test.executed_at}")
    print()
```

### **Method 3: Database Browser**
You can open `db.sqlite3` with:
- **DB Browser for SQLite** (free tool)
- **SQLite Studio** 
- **VS Code SQLite extension**

### **Method 4: API Endpoints**
Since your server is running, you can check via API:

```bash
# Login first
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "medabdelhedi@yahoo.fr", "password": "hama"}'

# Get all test results (replace TOKEN)
curl -X GET http://127.0.0.1:8000/api/testresults/ \
  -H "Authorization: Bearer TOKEN"

# Get statistics
curl -X GET http://127.0.0.1:8000/api/testresults/statistics/ \
  -H "Authorization: Bearer TOKEN"
```

## 📋 **Database Tables:**

Your database contains these main tables:
- **auth_user** (or accounts_user) - User accounts
- **testresults_testresult** - Test results data  
- **authtoken_* / simplejwt_**** - JWT token management
- **django_migrations** - Migration history
- **django_admin_log** - Admin activity log

## 🎯 **Quick Stats:**
Based on your uploaded files, you have at least **12 test results** with file uploads!

Your database is working perfectly with JWT authentication and file uploads! 🚀
