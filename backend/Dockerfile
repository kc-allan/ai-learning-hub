FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    cron \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Change this line to use the full path from the context
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory
COPY backend/ .

EXPOSE 8000

ENV PYTHONUNBUFFERED=1

# Adjust these paths accordingly
COPY backend/entrypoint.sh /app/entrypoint.sh
COPY backend/jobs.cron /etc/cron.d/fetch_ai_news_cron
RUN chmod +x /app/entrypoint.sh

# Apply the cron job
RUN jobs.cron /etc/cron.d/jobs.cron

CMD ["/app/entrypoint.sh"]