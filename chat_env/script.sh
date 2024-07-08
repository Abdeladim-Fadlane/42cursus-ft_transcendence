#!/bin/bash
sleep 3 
echo "PostgreSQL is now running!"
echo "Starting Django server...."

python manage.py makemigrations
python manage.py migrate

python manage.py runserver 0.0.0.0:8003 

# SUPERUSER_EMAIL="akatfi@example.com"
# SUPERUSER_USERNAME="akatfi"
# SUPERUSER_PASSWORD="12345"

# Export variables for use by Django
# export DJANGO_SUPERUSER_EMAIL=$SUPERUSER_EMAIL
# export DJANGO_SUPERUSER_USERNAME=$SUPERUSER_USERNAME
# export DJANGO_SUPERUSER_PASSWORD=$SUPERUSER_PASSWORD

# python manage.py createsuperuser --noinput