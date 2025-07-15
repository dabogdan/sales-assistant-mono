# Базовый образ Python
FROM python:3.10-slim

# Установим зависимости системы
RUN apt-get update && apt-get install -y \
    ffmpeg libsndfile1 libgl1 libasound2 supervisor \
    && rm -rf /var/lib/apt/lists/*

# Установим рабочую директорию
WORKDIR /app

# Копируем все файлы в контейнер
COPY . .

# Установим Python-зависимости
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Создадим лог-файлы для supervisord
RUN mkdir -p /var/log/supervisor

# Копируем конфиг supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Запускаем supervisor
CMD ["/usr/bin/supervisord", "-n"]
