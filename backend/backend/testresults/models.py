from django.db import models
from django.conf import settings
import os

def test_file_upload_path(instance, filename):
    """
    Generate file path: testresults/test_files/{filename}
    """
    return os.path.join('testresults', 'test_files', filename)

class TestResult(models.Model):
    test_name = models.CharField(max_length=200)
    status = models.CharField(max_length=50)
    executed_at = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)
    test_file = models.FileField(
        upload_to=test_file_upload_path,
        blank=True,
        null=True,
        help_text="Upload test result file (logs, reports, etc.)"
    )
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        help_text="User who uploaded this test result"
    )

    def __str__(self):
        return f"{self.test_name} - {self.status}"
    
    @property
    def file_url(self):
        """Get the file URL if file exists"""
        if self.test_file:
            return self.test_file.url
        return None
    
    @property
    def file_name(self):
        """Get the original filename"""
        if self.test_file:
            return os.path.basename(self.test_file.name)
        return None
