import requests

def test_file_upload():
    """Test file upload with TestResult"""
    
    # 1. Login first
    login_data = {
        "email": "medabdelhedi@yahoo.fr",
        "password": "hama"  # Your correct password
    }
    
    response = requests.post("http://127.0.0.1:8000/api/auth/login/", json=login_data)
    
    if response.status_code == 200:
        token = response.json()['access']
        print(f"✅ Login successful! Token: {token[:50]}...")
        
        # 2. Upload file with TestResult
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create a test file if it doesn't exist
        test_file_path = "c:/aaa.txt"
        with open(test_file_path, 'w') as f:
            f.write("This is a test file for upload\nLine 2\nLine 3")
        
        # Upload using files parameter (not json)
        with open(test_file_path, 'rb') as file:
            files = {'test_file': file}
            data = {
                'test_name': 'File Upload Test',
                'status': 'PASSED',
                'details': 'Testing actual file upload'
            }
            
            upload_response = requests.post(
                "http://127.0.0.1:8000/api/testresults/",
                headers=headers,
                files=files,
                data=data  # Use data, not json
            )
        
        print(f"Upload Status: {upload_response.status_code}")
        
        if upload_response.status_code == 201:
            result = upload_response.json()
            print("✅ File uploaded successfully!")
            print(f"📁 File URL: {result.get('file_url')}")
            print(f"📄 File Name: {result.get('file_name')}")
            print(f"💾 Test File: {result.get('test_file')}")
        else:
            print(f"❌ Upload failed: {upload_response.text}")
    else:
        print(f"❌ Login failed: {response.text}")

if __name__ == "__main__":
    test_file_upload()
