FROM python:3.8-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    cron \
    netcat \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .


EXPOSE 8000


ENV PYTHONUNBUFFERED=1

COPY ./entrypoint.sh /app/entrypoint.sh
COPY ./crontab /etc/cron.d/fetch_ai_news_cron
RUN chmod +x /app/entrypoint.sh

# Apply the cron job
RUN crontab /etc/cron.d/fetch_ai_news_cron

CMD ["/app/entrypoint.sh"]
