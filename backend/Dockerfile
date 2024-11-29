FROM python:3.12-slim

WORKDIR /app

# Install necessary packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    cron \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variable to prevent Python from buffering output
ENV PYTHONUNBUFFERED=1

# Copy the cron jobs
COPY jobs.cron /etc/cron.d/fetch_ai_news_cron

# Apply cron jobs
RUN chmod 0644 /etc/cron.d/fetch_ai_news_cron
RUN crontab /etc/cron.d/fetch_ai_news_cron

RUN python manage.py makemigrations
RUN python manage.py migrate
# RUN python manage.py seed_courses
RUN python manage.py create_admin
RUN python manage.py add_forums
RUN python manage.py collectstatic --noinput
RUN service cron start

RUN pip install gunicorn
# Expose the application port
EXPOSE 8000

# Run the entrypoint script
# CMD ["gunicorn" "ai_hub.wsgi:application" "--bind" "0.0.0.0:8000"]
CMD ["python" "manage.py" "runserver"]
