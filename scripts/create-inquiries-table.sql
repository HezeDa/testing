-- Создание таблицы заявок
CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание индекса для оптимизации поиска по статусу
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

-- Создание индекса для оптимизации сортировки по дате
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

-- Добавление комментариев к таблице и колонкам
COMMENT ON TABLE inquiries IS 'Таблица для хранения заявок от пользователей';
COMMENT ON COLUMN inquiries.name IS 'Имя пользователя';
COMMENT ON COLUMN inquiries.email IS 'Email пользователя';
COMMENT ON COLUMN inquiries.phone IS 'Телефон пользователя';
COMMENT ON COLUMN inquiries.message IS 'Сообщение пользователя';
COMMENT ON COLUMN inquiries.status IS 'Статус заявки (new, in_progress, completed)';
COMMENT ON COLUMN inquiries.notes IS 'Заметки администратора';
COMMENT ON COLUMN inquiries.created_at IS 'Дата создания заявки';
COMMENT ON COLUMN inquiries.updated_at IS 'Дата последнего обновления заявки'; 