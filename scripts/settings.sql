-- Создание таблицы настроек
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Только одна запись
  site_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  whatsapp_number VARCHAR(20),
  maintenance_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание индекса для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_settings_id ON settings(id);

-- Вставка начальных данных
INSERT INTO settings (
  site_name,
  contact_email,
  contact_phone,
  address,
  meta_description,
  meta_keywords,
  maintenance_mode
) VALUES (
  'Cyprus Elite Estates',
  'info@cypruseliteestates.com',
  '+357 25 123 456',
  'Лимассол, Кипр',
  'Элитная недвижимость на Кипре — ваш ключ к безмятежности и выгодным инвестициям',
  'недвижимость кипр, элитная недвижимость, виллы кипр, апартаменты кипр',
  false
) ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone,
  address = EXCLUDED.address,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  maintenance_mode = EXCLUDED.maintenance_mode,
  updated_at = CURRENT_TIMESTAMP; 