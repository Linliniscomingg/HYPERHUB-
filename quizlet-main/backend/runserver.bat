python -m venv .venv
@REM .\\venv\Scripts\\activate & pip install -r requirements.txt

.\\venv\Scripts\\activate & python manage.py makemigrations & python manage.py migrate & python manage.py runserver
