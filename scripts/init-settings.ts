import { pool } from "../src/lib/db"

async function initSettings() {
  const client = await pool.connect()
  
  try {
    // Создание таблицы настроек
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
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
      )
    `)

    // Создание индекса
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_settings_id ON settings(id)
    `)

    // Вставка начальных данных
    await client.query(`
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
      ) ON CONFLICT (id) DO NOTHING
    `)

    console.log("Настройки успешно инициализированы")
  } catch (error) {
    console.error("Ошибка при инициализации настроек:", error)
  } finally {
    client.release()
    await pool.end()
  }
}

initSettings() 