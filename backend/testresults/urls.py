from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestResultViewSet

router = DefaultRouter()
router.register(r'testresults', TestResultViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
