#!/bin/bash
echo "Timeout banco de dados"
python -c "
import socket, time
while True:
    try:
        s = socket.create_connection(('db', 5432), timeout=1)
        s.close()
        break
    except (socket.error, ConnectionRefusedError):
        time.sleep(1)
"
echo "Banco On."
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --timeout 30 --keep-alive 2 --workers 2
