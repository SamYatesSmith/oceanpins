from django.db import migrations, models
from django.conf import settings

def assign_default_users(apps, schema_editor):
    DiveLog = apps.get_model('dives', 'DiveLog')
    User = apps.get_model(settings.AUTH_USER_MODEL)

    superuser = User.objects.filter(is_superuser=True).first()
    for divelog in DiveLog.objects.filter(user__isnull=True):
        divelog.user = superuser
        divelog.save()

class Migration(migrations.Migration):

    dependencies = [
        ('dives', '0003_divelog_user'),
    ]

    operations = [
        migrations.RunPython(assign_default_users),
    ]
