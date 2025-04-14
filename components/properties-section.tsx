import { pool } from "@/lib/db"
import PropertySlider from "./property-slider"

export default async function PropertiesSection() {
  try {
    const { rows: properties } = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.location,
        p.price,
        p.bedrooms,
        p.bathrooms,
        p.area,
        p.slug,
        pi.url as featured_image
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = true
      WHERE p.featured = true
      ORDER BY p.created_at DESC
      LIMIT 6
    `)

    if (!properties || properties.length === 0) {
      return null
    }

    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-bold mb-4">Премиальная недвижимость</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Откройте для себя наш эксклюзивный выбор элитной недвижимости на Кипре
            </p>
          </div>
          <PropertySlider properties={properties} />
        </div>
      </section>
    )
  } catch (error) {
    console.error('Ошибка при загрузке недвижимости:', error)
    return null
  }
} 