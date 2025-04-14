import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { z } from "zod"

// Схема валидации для создания объекта недвижимости
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
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional(),
        isPrimary: z.boolean().default(false),
      }),
    )
    .optional(),
})

// GET /api/properties - получение списка объектов
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const region = searchParams.get("region")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const bedrooms = searchParams.get("bedrooms")
    const status = searchParams.get("status")

    let query = `
      SELECT 
        p.*,
        pi.url as primary_image,
        COALESCE(
          json_agg(
            json_build_object(
              'url', pi2.url,
              'alt', pi2.alt,
              'is_primary', pi2.is_primary
            )
          ) FILTER (WHERE pi2.url IS NOT NULL),
          '[]'::json
        ) as images
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = true
      LEFT JOIN property_images pi2 ON p.id = pi2.property_id
      WHERE p.status = 'active'
    `
    const queryParams: any[] = []
    let paramCount = 1

    if (type) {
      query += ` AND p.type = $${paramCount}`
      queryParams.push(type)
      paramCount++
    }

    if (region) {
      query += ` AND p.region = $${paramCount}`
      queryParams.push(region)
      paramCount++
    }

    if (minPrice) {
      query += ` AND p.price >= $${paramCount}`
      queryParams.push(minPrice)
      paramCount++
    }

    if (maxPrice) {
      query += ` AND p.price <= $${paramCount}`
      queryParams.push(maxPrice)
      paramCount++
    }

    if (bedrooms) {
      query += ` AND p.bedrooms = $${paramCount}`
      queryParams.push(bedrooms)
      paramCount++
    }

    if (status) {
      query += ` AND p.status = $${paramCount}`
      queryParams.push(status)
      paramCount++
    }

    query += " GROUP BY p.id, pi.url"

    const result = await pool.query(query, queryParams)

    return NextResponse.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    console.error("Error fetching properties:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при получении списка объектов",
      },
      { status: 500 }
    )
  }
}

// POST /api/properties - создание нового объекта
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = propertySchema.parse(body)
    const { features: featuresList, images: imagesList, ...propertyData } = validatedData

    // Начинаем транзакцию
    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      // Создаем объект недвижимости
      const propertyResult = await client.query(
        `
        INSERT INTO properties (
          title, slug, description, location, region, price, type, status,
          bedrooms, bathrooms, area, featured
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
      `,
        [
          propertyData.title,
          propertyData.slug,
          propertyData.description,
          propertyData.location,
          propertyData.region,
          propertyData.price,
          propertyData.type,
          propertyData.status,
          propertyData.bedrooms,
          propertyData.bathrooms,
          propertyData.area,
          propertyData.featured,
        ]
      )

      const propertyId = propertyResult.rows[0].id

      // Добавляем особенности
      if (featuresList && featuresList.length > 0) {
        for (const feature of featuresList) {
          await client.query(
            "INSERT INTO property_features (property_id, feature) VALUES ($1, $2)",
            [propertyId, feature]
          )
        }
      }

      // Добавляем изображения
      if (imagesList && imagesList.length > 0) {
        for (const image of imagesList) {
          await client.query(
            `
            INSERT INTO property_images (property_id, url, alt, is_primary)
            VALUES ($1, $2, $3, $4)
          `,
            [propertyId, image.url, image.alt || null, image.isPrimary]
          )
        }
      }

      await client.query("COMMIT")

      return NextResponse.json({
        success: true,
        data: { id: propertyId, ...propertyData },
      })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Ошибка валидации данных",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    console.error("Error creating property:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при создании объекта",
      },
      { status: 500 }
    )
  }
}
