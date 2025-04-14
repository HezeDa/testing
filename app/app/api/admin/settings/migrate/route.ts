import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function POST() {
  const client = await pool.connect()

  try {
    await client.query(`
      -- Добавляем основные колонки
      ALTER TABLE settings
      ADD COLUMN IF NOT EXISTS site_name VARCHAR(255) NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS meta_description TEXT,
      ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
      ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT false;

      -- Добавляем контактную информацию
      ALTER TABLE settings
      ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255) NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(255) NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS address TEXT NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS working_hours VARCHAR(255);

      -- Добавляем социальные сети
      ALTER TABLE settings
      ADD COLUMN IF NOT EXISTS facebook_url TEXT,
      ADD COLUMN IF NOT EXISTS instagram_url TEXT,
      ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(255);

      -- Добавляем колонки для шапки сайта
      ALTER TABLE settings
      ADD COLUMN IF NOT EXISTS header_phone VARCHAR(255) NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS header_email VARCHAR(255) NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS show_social_in_header BOOLEAN DEFAULT true;

      -- Добавляем колонки для подвала сайта
      ALTER TABLE settings
      ADD COLUMN IF NOT EXISTS footer_description TEXT,
      ADD COLUMN IF NOT EXISTS footer_copyright TEXT,
      ADD COLUMN IF NOT EXISTS show_social_in_footer BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS show_contact_in_footer BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS show_working_hours_in_footer BOOLEAN DEFAULT true;

      -- Добавляем временные метки, если их нет
      ALTER TABLE settings
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `)

    return NextResponse.json({ success: true, message: "Миграция выполнена успешно" })
  } catch (error) {
    console.error("Error during migration:", error)
    return NextResponse.json(
      { success: false, error: "Ошибка при выполнении миграции" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
} 