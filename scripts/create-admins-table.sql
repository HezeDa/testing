-- Создание таблицы администраторов
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание индекса для поиска по email
CREATE INDEX IF NOT EXISTS admins_email_idx ON admins(email);

-- Добавление комментариев к таблице и колонкам
COMMENT ON TABLE admins IS 'Таблица администраторов сайта';
COMMENT ON COLUMN admins.id IS 'Уникальный идентификатор администратора';
COMMENT ON COLUMN admins.name IS 'Имя администратора';
COMMENT ON COLUMN admins.email IS 'Email администратора';
COMMENT ON COLUMN admins.phone IS 'Телефон администратора';
COMMENT ON COLUMN admins.password IS 'Хеш пароля администратора';
COMMENT ON COLUMN admins.created_at IS 'Дата создания записи';
COMMENT ON COLUMN admins.updated_at IS 'Дата последнего обновления записи'; 