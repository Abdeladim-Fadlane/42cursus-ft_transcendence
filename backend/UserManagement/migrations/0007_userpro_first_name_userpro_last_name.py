# Generated by Django 5.0.6 on 2024-06-05 15:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserManagement', '0006_remove_userpro_token_access'),
    ]

    operations = [
        migrations.AddField(
            model_name='userpro',
            name='first_name',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='userpro',
            name='last_name',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
