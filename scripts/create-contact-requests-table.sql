-- Создание таблицы contact_requests
CREATE TABLE IF NOT EXISTS contact_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    status VARCHAR(50) DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at);

-- Комментарии к таблице и колонкам
COMMENT ON TABLE contact_requests IS 'Таблица для хранения заявок на контакт';
COMMENT ON COLUMN contact_requests.id IS 'Уникальный идентификатор заявки';
COMMENT ON COLUMN contact_requests.name IS 'Имя отправителя';
COMMENT ON COLUMN contact_requests.email IS 'Email отправителя';
COMMENT ON COLUMN contact_requests.phone IS 'Телефон отправителя';
COMMENT ON COLUMN contact_requests.message IS 'Текст сообщения';
COMMENT ON COLUMN contact_requests.type IS 'Тип заявки (general, property, etc.)';
COMMENT ON COLUMN contact_requests.status IS 'Статус заявки (new, in_progress, completed)';
COMMENT ON COLUMN contact_requests.notes IS 'Заметки администратора';
COMMENT ON COLUMN contact_requests.created_at IS 'Дата и время создания заявки';
COMMENT ON COLUMN contact_requests.updated_at IS 'Дата и время последнего обновления'; 