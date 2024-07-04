#!/bin/bash

sleep 3
echo "PostgreSQL is now running!"
echo "Starting Django server...."

# python manage.py makemigrations
# python manage.py migrate

python manage.py runserver 0.0.0.0:8001


