from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # REST API endpoints
    path('api/auth/', include('apps.accounts.urls')),
    path('api/employees/', include('apps.employees.urls')),
    path('api/ndas/', include('apps.ndas.urls')),
    path('api/documents/', include('apps.documents.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Serve media files
    *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),

    # Catch-all: serve React SPA for every other URL
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='react-app'),
]
