from django.contrib import admin
from .models import TestResult

@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = ['test_name', 'status', 'uploaded_by', 'file_name', 'executed_at']
    list_filter = ['status', 'uploaded_by', 'executed_at']
    search_fields = ['test_name', 'details', 'uploaded_by__username']
    readonly_fields = ['executed_at', 'file_url', 'file_name']
    date_hierarchy = 'executed_at'
    
    fieldsets = (
        ('Test Information', {
            'fields': ('test_name', 'status', 'details')
        }),
        ('File Upload', {
            'fields': ('test_file', 'file_url', 'file_name')
        }),
        ('User & Timestamps', {
            'fields': ('uploaded_by', 'executed_at')
        }),
    )
