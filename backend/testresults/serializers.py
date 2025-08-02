from rest_framework import serializers
from django.conf import settings
from django.contrib.auth import get_user_model
from .models import TestResult

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'full_name']

class TestResultSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()
    uploaded_by = UserSerializer(read_only=True)
    uploaded_by_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = TestResult
        fields = [
            'id',
            'test_name',
            'status', 
            'executed_at',
            'details',
            'test_file',
            'file_url',
            'file_name',
            'uploaded_by',
            'uploaded_by_id',
        ]
        read_only_fields = ['executed_at', 'file_url', 'file_name', 'uploaded_by']
    
    def get_file_url(self, obj):
        """Get the file URL"""
        if obj.test_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.test_file.url)
            return obj.test_file.url
        return None
    
    def get_file_name(self, obj):
        """Get the original filename"""
        return obj.file_name
    
    def validate_status(self, value):
        """Validate status field"""
        valid_statuses = ['PASSED', 'FAILED', 'PENDING', 'SKIPPED', 'PASS', 'FAIL']
        if value.upper() not in [s.upper() for s in valid_statuses]:
            raise serializers.ValidationError(f"Status must be one of {valid_statuses}")
        return value.upper()
    
    def validate_test_file(self, value):
        """Validate uploaded file"""
        if value:
            # Check file size (limit to 10MB)
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("File size cannot exceed 10MB")
            
            # Check file type (allow common test result formats)
            allowed_extensions = ['.txt', '.log', '.json', '.xml', '.csv', '.pdf', '.html', '.zip']
            file_extension = '.' + value.name.lower().split('.')[-1]
            if file_extension not in allowed_extensions:
                raise serializers.ValidationError(
                    f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
                )
        return value
