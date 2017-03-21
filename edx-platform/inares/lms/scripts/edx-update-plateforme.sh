#!/bin/bash

sudo /edx/bin/supervisorctl -c /edx/etc/supervisord.conf stop edxapp:
sudo /edx/bin/supervisorctl -c /edx/etc/supervisord.conf stop edxapp_worker:
cd /edx/app/edxapp/edx-platform/
sudo git pull
sudo chown -R edxapp:edxapp *
time /edx/bin/update edx-platform release
sudo -u www-data time /edx/app/edxapp/venvs/edxapp/bin/python ./manage.py lms syncdb --migrate --settings aws
sudo -u www-data time /edx/app/edxapp/venvs/edxapp/bin/python ./manage.py cms syncdb --migrate --settings aws
#sudo /edx/bin/supervisorctl -c /edx/etc/supervisord.conf start edxapp:
sudo /edx/bin/supervisorctl -c /edx/etc/supervisord.conf start edxapp_worker:
