from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import TestResult
from .serializers import TestResultSerializer

class TestResultViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing test results with full CRUD operations
    """
    queryset = TestResult.objects.all()
    serializer_class = TestResultSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'uploaded_by']
    search_fields = ['test_name', 'details']
    ordering_fields = ['executed_at', 'test_name']
    ordering = ['-executed_at']
    
    def perform_create(self, serializer):
        """Set the uploaded_by field to current user if authenticated"""
        if self.request.user.is_authenticated:
            serializer.save(uploaded_by=self.request.user)
        else:
            # If user provides uploaded_by_id in the request, use it
            uploaded_by_id = self.request.data.get('uploaded_by_id')
            if uploaded_by_id:
                serializer.save(uploaded_by_id=uploaded_by_id)
            else:
                serializer.save()
    
    def perform_update(self, serializer):
        """Update uploaded_by field if provided"""
        uploaded_by_id = self.request.data.get('uploaded_by_id')
        if uploaded_by_id:
            serializer.save(uploaded_by_id=uploaded_by_id)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get test results statistics"""
        queryset = self.filter_queryset(self.get_queryset())
        
        total_tests = queryset.count()
        passed_tests = queryset.filter(status='PASS').count()
        failed_tests = queryset.filter(status='FAIL').count()
        pending_tests = queryset.filter(status='PENDING').count()
        skipped_tests = queryset.filter(status='SKIPPED').count()
        
        pass_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        return Response({
            'total_tests': total_tests,
            'passed_tests': passed_tests,
            'failed_tests': failed_tests,
            'pending_tests': pending_tests,
            'skipped_tests': skipped_tests,
            'pass_rate': round(pass_rate, 2)
        })
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """Create multiple test results at once"""
        serializer = TestResultSerializer(data=request.data, many=True, context={'request': request})
        if serializer.is_valid():
            test_results = []
            for item in serializer.validated_data:
                # Set uploaded_by for each item if user is authenticated
                if self.request.user.is_authenticated:
                    item['uploaded_by'] = self.request.user
                test_results.append(TestResult(**item))
            
            TestResult.objects.bulk_create(test_results)
            return Response(
                {'message': f'Successfully created {len(test_results)} test results'}, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
