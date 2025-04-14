import { pool } from "../src/lib/db"
import dotenv from 'dotenv'

dotenv.config()

console.log('Проверка переменных окружения:')
console.log('DATABASE_URL:', process.env.DATABASE_URL)
console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST)
console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT)
console.log('POSTGRES_DB:', process.env.POSTGRES_DB)
console.log('POSTGRES_USER:', process.env.POSTGRES_USER)

async function init() {
  try {
    console.log("🌱 Начало инициализации базы данных...")

    // Создаем таблицы
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS blog_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        location VARCHAR(255) NOT NULL,
        region VARCHAR(50) NOT NULL,
        price INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        bedrooms INTEGER NOT NULL,
        bathrooms INTEGER NOT NULL,
        area INTEGER NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Добавляем поле slug, если оно не существует
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'properties' AND column_name = 'slug') THEN
          ALTER TABLE properties ADD COLUMN slug VARCHAR(255) UNIQUE;
          
          -- Обновляем существующие записи
          UPDATE properties SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
          WHERE slug IS NULL;
        END IF;
      END $$;

      CREATE TABLE IF NOT EXISTS property_images (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) NOT NULL,
        url VARCHAR(255) NOT NULL,
        alt VARCHAR(255),
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS property_features (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) NOT NULL,
        feature VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS blog_articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        category_id INTEGER REFERENCES blog_categories(id) NOT NULL,
        author_id INTEGER REFERENCES users(id) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'draft',
        featured BOOLEAN DEFAULT FALSE,
        featured_image VARCHAR(255),
        meta_title VARCHAR(255),
        meta_description TEXT,
        meta_keywords TEXT,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Добавляем поля для SEO-метаданных, если они не существуют
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'blog_articles' AND column_name = 'meta_title') THEN
          ALTER TABLE blog_articles ADD COLUMN meta_title VARCHAR(255);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'blog_articles' AND column_name = 'meta_description') THEN
          ALTER TABLE blog_articles ADD COLUMN meta_description TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'blog_articles' AND column_name = 'meta_keywords') THEN
          ALTER TABLE blog_articles ADD COLUMN meta_keywords TEXT;
        END IF;
      END $$;
    `);

    console.log("✅ База данных успешно инициализирована")
  } catch (error) {
    console.error("❌ Ошибка при инициализации базы данных:", error)
  } finally {
    await pool.end();
    process.exit(0)
  }
}

init() 