# 🛠️ SQLite Browser Tools

## 🏆 **Best SQLite Browser Tools:**

### **1. DB Browser for SQLite (Most Recommended)**
- **Website:** https://sqlitebrowser.org/
- **Free:** ✅ Yes, completely free
- **Platform:** Windows, Mac, Linux
- **Features:**
  - Visual table browser
  - SQL query editor
  - Data editing capabilities
  - Database structure viewer
  - Import/Export tools

**How to use:**
1. Download from https://sqlitebrowser.org/dl/
2. Install and open
3. File → Open Database → Select `db.sqlite3`
4. Browse your tables: `accounts_user`, `testresults_testresult`, etc.

### **2. SQLite Studio**
- **Website:** https://sqlitestudio.pl/
- **Free:** ✅ Yes
- **Platform:** Windows, Mac, Linux
- **Features:**
  - Multi-database support
  - Advanced SQL editor
  - Data export/import
  - Plugin system

### **3. VS Code Extension (If you use VS Code)**
- **Extension:** SQLite Viewer
- **Install:** In VS Code Extensions, search "SQLite Viewer"
- **How to use:**
  1. Install extension
  2. Right-click on `db.sqlite3` file
  3. Select "Open with SQLite Viewer"

### **4. SQLiteOnline (Web-based)**
- **Website:** https://sqliteonline.com/
- **Free:** ✅ Yes
- **Platform:** Web browser (no installation)
- **How to use:**
  1. Go to website
  2. Click "File" → "Open DB"
  3. Upload your `db.sqlite3` file

### **5. DBeaver (Advanced)**
- **Website:** https://dbeaver.io/
- **Free:** ✅ Community edition
- **Platform:** Windows, Mac, Linux
- **Features:**
  - Professional database tool
  - Supports many database types
  - Advanced SQL features
  - ER diagrams

## 🚀 **Quick Start Guide:**

### **Recommended: DB Browser for SQLite**

1. **Download:** https://sqlitebrowser.org/dl/
2. **Install** the Windows version
3. **Open** the application
4. **File → Open Database**
5. **Navigate** to: `C:\Users\lenovo\Desktop\Internship25\react-django\backend\db.sqlite3`
6. **Browse** your data:
   - Click on "Browse Data" tab
   - Select table from dropdown:
     - `accounts_user` - Your user accounts
     - `testresults_testresult` - Your test results
     - `authtoken_outstandingtoken` - JWT tokens

## 📊 **What You'll See in Your Database:**

### **accounts_user table:**
- id, username, email, first_name, last_name, password, etc.

### **testresults_testresult table:**
- id, test_name, status, executed_at, details, test_file, uploaded_by_id

### **Other tables:**
- django_migrations (migration history)
- django_admin_log (admin actions)
- authtoken_* (JWT token data)

## 💡 **Pro Tips:**

1. **Backup First:** Always backup your `db.sqlite3` before making changes
2. **Read-Only:** Use browser tools just for viewing, not editing
3. **SQL Queries:** You can run custom SQL queries to analyze your data
4. **Export:** Most tools allow exporting data to CSV, JSON, etc.

## 🎯 **Quick SQL Queries to Try:**

```sql
-- Count total users
SELECT COUNT(*) FROM accounts_user;

-- Count test results by status
SELECT status, COUNT(*) 
FROM testresults_testresult 
GROUP BY status;

-- Recent test results with user info
SELECT tr.test_name, tr.status, tr.executed_at, au.username, au.email
FROM testresults_testresult tr
JOIN accounts_user au ON tr.uploaded_by_id = au.id
ORDER BY tr.executed_at DESC
LIMIT 10;

-- Test results with files
SELECT test_name, test_file, executed_at 
FROM testresults_testresult 
WHERE test_file IS NOT NULL;
```

**Download DB Browser for SQLite now:** https://sqlitebrowser.org/dl/ 🚀
