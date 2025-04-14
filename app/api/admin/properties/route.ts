import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { z } from "zod"

const propertySchema = z.object({
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string().optional(),
  location: z.string().optional(),
  region: z.enum(["limassol", "paphos", "protaras", "larnaca", "nicosia"]),
  price: z.number().positive(),
  type: z.enum(["villa", "apartment", "townhouse", "penthouse"]),
  status: z.enum(["active", "draft", "sold", "reserved"]).default("draft"),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  area: z.number().int().nonnegative().optional(),
  featured: z.boolean().default(false),
  features: z.array(z.string()).optional(),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    is_primary: z.boolean().default(false)
  })).optional()
})

export async function GET() {
  try {
    const { rows: properties } = await pool.query(`
      SELECT 
        p.*,
        pi.url as image_url,
        array_agg(pf.feature) as features
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = true
      LEFT JOIN property_features pf ON p.id = pf.property_id
      GROUP BY p.id, pi.url
      ORDER BY p.created_at DESC
    `)

    return NextResponse.json({
      success: true,
      data: properties
    })

  } catch (error) {
    console.error("Ошибка при получении списка объектов:", error)
    return NextResponse.json({
      success: false,
      error: "Ошибка при получении списка объектов",
      details: String(error)
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Валидация данных
    const validatedData = propertySchema.parse(data)

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Сохраняем основную информацию об объекте
      const propertyResult = await client.query(
        `INSERT INTO properties (
          title, slug, type, region, location, price, status, description,
          featured, bedrooms, bathrooms, area
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id`,
        [
          validatedData.title,
          validatedData.slug || validatedData.title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
          validatedData.type,
          validatedData.region,
          validatedData.location,
          validatedData.price,
          validatedData.status,
          validatedData.description,
          validatedData.featured,
          validatedData.bedrooms,
          validatedData.bathrooms,
          validatedData.area
        ]
      )

      const propertyId = propertyResult.rows[0].id

      // Сохраняем изображения
      if (validatedData.images && validatedData.images.length > 0) {
        for (const image of validatedData.images) {
          await client.query(
            `INSERT INTO property_images (property_id, url, alt, is_primary) 
             VALUES ($1, $2, $3, $4)`,
            [propertyId, image.url, image.alt || null, image.is_primary]
          )
        }
      }

      // Сохраняем особенности
      if (validatedData.features && validatedData.features.length > 0) {
        for (const feature of validatedData.features) {
          await client.query(
            `INSERT INTO property_features (property_id, feature) VALUES ($1, $2)`,
            [propertyId, feature]
          )
        }
      }

      await client.query('COMMIT')

      return NextResponse.json({
        success: true,
        data: { id: propertyId }
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error saving property:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при сохранении объекта' },
      { status: 500 }
    )
  }
} 