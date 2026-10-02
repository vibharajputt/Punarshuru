-- MySQL init script: grants and schema setup
-- The DB 'punarshuru' is auto-created by MYSQL_DATABASE env var
-- This file adds any extra grants or settings

CREATE DATABASE IF NOT EXISTS punarshuru CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

GRANT ALL PRIVILEGES ON punarshuru.* TO 'punarshuru'@'%';
FLUSH PRIVILEGES;
