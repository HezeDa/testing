import { pool } from "../lib/db"

const properties = [

  {
    title: "Del Mar",
    location: "Лимасол, первая береговая",
    region: "Лимасол",
    type: "apartment",
    price: 1200000,
    bedrooms: 2,
    bathrooms: 2,
    area: 90,
    description: "Готовый комплекс, первая береговая, через дорогу от моря, квартиры",
    featured: true,
    slug: "del-mar"
  },
  {
    title: "The One",
    location: "Лимасол, первая береговая линия",
    region: "Лимасол",
    type: "apartment",
    price: 2500000,
    bedrooms: 3,
    bathrooms: 3,
    area: 150,
    description: "Готов, высотка, первая береговая линия. Квартира 3 bdr, дуплекс и скай вилла.",
    featured: true,
    slug: "the-one"
  },
  {
    title: "Limassol Marina",
    location: "Лимасол, яхтенная Марина",
    region: "Лимасол",
    type: "apartment",
    price: 3000000,
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    description: "Готовый, яхтенная Марина, первая линия со своим пляжем и причалом для яхт. Апартаменты, пентхаус и виллы. Близко к деловому центру Лимасола.",
    featured: true,
    slug: "limassol-marina"
  },
  {
    title: "Icon",
    location: "Лимасол, вторая линия",
    region: "Лимасол",
    type: "apartment",
    price: 1800000,
    bedrooms: 3,
    bathrooms: 2,
    area: 130,
    description: "Готов, высокая, вторая линия, прямые виды на море.",
    featured: true,
    slug: "icon"
  },
  {
    title: "Londa",
    location: "Лимасол, первая береговая линия",
    region: "Лимасол",
    type: "apartment",
    price: 2200000,
    bedrooms: 3,
    bathrooms: 3,
    area: 160,
    description: "80 % готовности, первая береговая линия, премиальный невысотный комплекс.",
    featured: true,
    slug: "londa"
  },
  {
    title: "Dream Tower",
    location: "Amathus avenue, первая береговая",
    region: "Лимасол",
    type: "apartment",
    price: 1600000,
    bedrooms: 2,
    bathrooms: 2,
    area: 100,
    description: "Amathus avenue, первая береговая, через дорогу от моря. Готовый, высотка. Квартиры.",
    featured: true,
    slug: "dream-tower"
  },
  {
    title: "Ritz Carlton",
    location: "Лимасол, первая береговая линия",
    region: "Лимасол",
    type: "apartment",
    price: 2800000,
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    description: "Готовый комплекс, первая береговая линия, через дорогу от моря. Квартиры.",
    featured: true,
    slug: "ritz-carlton"
  },
  {
    title: "Symbol",
    location: "Лимасол, первая береговая линия",
    region: "Лимасол",
    type: "apartment",
    price: 2000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    description: "Готовый невысотный клубный дом, первая береговая линия, рядом с Four Seasons. Квартиры.",
    featured: true,
    slug: "symbol"
  },
  {
    title: "Amathus Residences",
    location: "Лимасол, первая береговая линия",
    region: "Лимасол",
    type: "apartment",
    price: 2400000,
    bedrooms: 3,
    bathrooms: 3,
    area: 170,
    description: "Готовый невысотный клубный дом, первая береговая линия, между Four Seasons и отелем Amathus. Квартиры.",
    featured: true,
    slug: "amathus-residences"
  },
  {
    title: "Amara Tower",
    location: "Лимасол, район отеля Amara",
    region: "Лимасол",
    type: "apartment",
    price: 1900000,
    bedrooms: 2,
    bathrooms: 2,
    area: 110,
    description: "Клубный дом, район отеля Amara и Four season. Квартиры",
    featured: true,
    slug: "amara-tower"
  },
  {
    title: "Marco Polo",
    location: "Лимасол, район Sant Rafael",
    region: "Лимасол",
    type: "apartment",
    price: 2100000,
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    description: "Готовый невысотный премиальный клубный дом в районе Sant Rafael и раскопок Amathus район",
    featured: true,
    slug: "marco-polo"
  }
]

async function seedProperties() {
  try {
    // Очищаем таблицы перед заполнением
    await pool.query("TRUNCATE TABLE property_images CASCADE")
    await pool.query("TRUNCATE TABLE properties CASCADE")

    // Заполняем таблицу properties
    for (const property of properties) {
      const result = await pool.query(
        `INSERT INTO properties (
          title, location, region, type, price, bedrooms, bathrooms, area, 
          description, featured, slug, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()) RETURNING id`,
        [
          property.title,
          property.location,
          property.region,
          property.type,
          property.price,
          property.bedrooms,
          property.bathrooms,
          property.area,
          property.description,
          property.featured,
          property.slug
        ]
      )

      // Добавляем заглушку для изображения
      await pool.query(
        "INSERT INTO property_images (property_id, url, alt, is_primary) VALUES ($1, '/placeholder.svg', $2, true)",
        [result.rows[0].id, property.title]
      )
    }

    console.log("База данных успешно заполнена!")
  } catch (error) {
    console.error("Ошибка при заполнении базы данных:", error)
  } finally {
    await pool.end()
  }
}

seedProperties() 