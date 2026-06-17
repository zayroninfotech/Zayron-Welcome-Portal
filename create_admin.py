import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onboarding.settings')
django.setup()

from apps.accounts.models import User

if not User.objects.filter(username='admin').exists():
    u = User.objects.create_superuser('admin', 'admin@zayroninfotech.com', 'Admin@123')
    u.role = 'superadmin'
    u.first_name = 'Super'
    u.last_name = 'Admin'
    u.save()
    print('Super Admin created!')
    print('  Username : admin')
    print('  Password : Admin@123')
else:
    print('Admin already exists (username: admin / password: Admin@123)')
