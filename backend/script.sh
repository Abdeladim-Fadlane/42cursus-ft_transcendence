#!/bin/bash

sleep 2 
echo "PostgreSQL is now running!"
echo "Starting Django server...."
# python manage.py makemigrations auth_app

python manage.py makemigrations 
python manage.py migrate

python manage.py runserver 0.0.0.0:8000 
