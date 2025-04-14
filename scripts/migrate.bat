@echo off

REM Параметры подключения к базе данных
set DB_HOST=pg-3b4de346-tricion219-17b2.k.aivencloud.com
set DB_PORT=12372
set DB_NAME=defaultdb
set DB_USER=avnadmin
set DB_PASSWORD=AVNS_Diaaf8DAEjsaaMSXdGf

REM Выполняем SQL-скрипт
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f migrate-properties.sql

echo Миграция завершена! 