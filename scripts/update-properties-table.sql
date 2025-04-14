-- Создаем таблицу properties, если она не существует
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area DECIMAL(10, 2),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем недостающие колонки, если они еще не существуют
DO $$
BEGIN
    -- Проверяем существование колонок перед добавлением
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'properties' AND column_name = 'year') THEN
        ALTER TABLE properties ADD COLUMN year INTEGER;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'properties' AND column_name = 'floors') THEN
        ALTER TABLE properties ADD COLUMN floors INTEGER;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'properties' AND column_name = 'pool') THEN
        ALTER TABLE properties ADD COLUMN pool BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'properties' AND column_name = 'garden') THEN
        ALTER TABLE properties ADD COLUMN garden BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'properties' AND column_name = 'garage') THEN
        ALTER TABLE properties ADD COLUMN garage BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'properties' AND column_name = 'sea_view') THEN
        ALTER TABLE properties ADD COLUMN sea_view BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'properties' AND column_name = 'air_conditioning') THEN
        ALTER TABLE properties ADD COLUMN air_conditioning BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'properties' AND column_name = 'heating') THEN
        ALTER TABLE properties ADD COLUMN heating BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Создаем таблицу для изображений, если она не существует
CREATE TABLE IF NOT EXISTS property_images (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создаем таблицу для особенностей, если она не существует
CREATE TABLE IF NOT EXISTS property_features (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    feature VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создаем индекс для ускорения поиска по slug
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

-- Создаем индекс для ускорения поиска по типу
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);

-- Создаем индекс для ускорения поиска по региону
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);

-- Создаем индекс для ускорения поиска по статусу
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status); 