#!/bin/bash

# Параметры подключения к базе данных
DB_HOST="pg-3b4de346-tricion219-17b2.k.aivencloud.com"
DB_PORT="12372"
DB_NAME="defaultdb"
DB_USER="avnadmin"
DB_PASSWORD="AVNS_Diaaf8DAEjsaaMSXdGf"

# Выполняем SQL-скрипт
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f migrate-properties.sql

echo "Миграция завершена!" 