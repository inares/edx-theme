#!/bin/bash

source /edx/app/edxapp/edxapp_env
cd /edx/app/edxapp/edx-platform
#time paver update_assets lms --settings=aws
time python manage.py lms --settings=aws collectstatic --noinput 
