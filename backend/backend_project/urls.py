from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

urlpatterns = [
    path('admin/', admin.site.urls),
<<<<<<< HEAD
    path('api/', include('core.urls')),            # API routes
    path('', include('testresults.urls')),         # App de résultats
    path('', lambda request: HttpResponse("Hello from Django backend!")),  # Page d’accueil
=======
    path('api/auth/', include('accounts.urls')),
    path('api/', include('testresults.urls')),
>>>>>>> upstream/main
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
