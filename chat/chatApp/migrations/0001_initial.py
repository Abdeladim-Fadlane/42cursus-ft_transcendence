# Generated by Django 5.0.6 on 2024-07-04 19:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_name', models.TextField()),
                ('created_at', models.DateTimeField(auto_now=True)),
                ('block_conversation', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(blank=True, default='', max_length=200, null=True)),
                ('sender_name', models.TextField(blank=True, default='', max_length=200, null=True)),
                ('time_added', models.DateTimeField(auto_now_add=True)),
                ('conversation', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='chatApp.conversation')),
            ],
            options={
                'ordering': ['time_added'],
            },
        ),
    ]
