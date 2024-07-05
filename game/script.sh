#!/bin/bash

sleep 5


python manage.py makemigrations
python manage.py migrate
# python manage.py makemigrations auth_app


python manage.py runserver 0.0.0.0:8001


