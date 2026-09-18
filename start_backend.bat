@echo off
echo Starting Django Backend for Christian Joseph Ostaga's Portfolio...
cd /d "%~dp0backend"
python manage.py runserver 127.0.0.1:8000
pause
