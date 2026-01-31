FROM python:3.9-slim

LABEL maintainer="Équipe SGAI"
LABEL service="schedule-optimizer"

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    FLASK_APP=app.py

WORKDIR /app

# Dépendances système
RUN apt-get update && apt-get install -y \
    gcc g++ \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Code source
COPY app.py .
COPY optimizer/ ./optimizer/
COPY config/ ./config/

RUN mkdir -p models logs

# Utilisateur non-root
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5001/health')"

CMD ["python", "-m", "gunicorn", "--bind", "0.0.0.0:5001", "--workers", "2", "--timeout", "300", "app:app"]