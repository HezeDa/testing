import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  logger.logApiCall(request.method, request.url, { params })
  
  try {
    const resolvedParams = await params
    const { slug } = resolvedParams
    logger.debug('Fetching property with slug:', { slug })

    // Сначала проверим, существует ли объект
    const checkQuery = `SELECT id FROM properties WHERE slug = $1`
    const checkResult = await pool.query(checkQuery, [slug])
    logger.debug('Check query result:', { exists: checkResult.rows.length > 0 })

    if (checkResult.rows.length === 0) {
      logger.warn('Property not found', { slug })
      return NextResponse.json(
        { success: false, error: "Объект не найден" },
        { status: 404 }
      )
    }

    const propertyId = checkResult.rows[0].id
    logger.debug('Property ID:', { propertyId })

    // Получаем основную информацию
    const mainQuery = `SELECT * FROM properties WHERE id = $1`
    const mainResult = await pool.query(mainQuery, [propertyId])
    logger.debug('Main query result:', { data: mainResult.rows[0] })

    // Получаем изображения
    const imagesQuery = `SELECT id, url, alt, is_primary FROM property_images WHERE property_id = $1`
    const imagesResult = await pool.query(imagesQuery, [propertyId])
    logger.debug('Images query result:', { images: imagesResult.rows })

    // Получаем особенности
    const featuresQuery = `SELECT feature FROM property_features WHERE property_id = $1`
    const featuresResult = await pool.query(featuresQuery, [propertyId])
    logger.debug('Features query result:', { features: featuresResult.rows })

    const property = {
      ...mainResult.rows[0],
      images: imagesResult.rows,
      features: featuresResult.rows.map(row => row.feature)
    }

    logger.info('Property retrieved successfully', { 
      slug,
      propertyId,
      hasImages: property.images.length > 0,
      hasFeatures: property.features.length > 0
    })

    return NextResponse.json({ success: true, data: property })
  } catch (error) {
    logger.error("Error retrieving property", error)
    return NextResponse.json(
      { success: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  logger.logApiCall(request.method, request.url, { params })
  
  try {
    const { slug } = params
    const data = await request.json()
    
    logger.debug('Update data:', data)

    // Начинаем транзакцию
    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Обновляем основную информацию об объекте
      const updateQuery = `UPDATE properties 
         SET title = $1, slug = $2, description = $3, location = $4, 
             region = $5, price = $6, type = $7, status = $8,
             bedrooms = $9, bathrooms = $10, area = $11, featured = $12
         WHERE slug = $13
         RETURNING id`
      
      const updateParams = [
        data.title,
        data.slug,
        data.description,
        data.location,
        data.region,
        data.price,
        data.type,
        data.status,
        data.bedrooms,
        data.bathrooms,
        data.area,
        data.featured,
        slug
      ]

      logger.logDatabaseQuery(updateQuery, updateParams)
      const result = await client.query(updateQuery, updateParams)

      if (result.rows.length === 0) {
        throw new Error("Объект не найден")
      }

      const propertyId = result.rows[0].id

      // Обновляем особенности
      await client.query('DELETE FROM property_features WHERE property_id = $1', [propertyId])
      if (data.features && data.features.length > 0) {
        const featuresValues = data.features.map((feature: string) => `(${propertyId}, '${feature}')`).join(',')
        await client.query(`INSERT INTO property_features (property_id, feature) VALUES ${featuresValues}`)
      }

      // Обновляем изображения
      await client.query('DELETE FROM property_images WHERE property_id = $1', [propertyId])
      if (data.images && data.images.length > 0) {
        const imagesValues = data.images.map((img: any) => 
          `(${propertyId}, '${img.url}', '${img.alt || ''}', ${img.is_primary})`
        ).join(',')
        await client.query(`INSERT INTO property_images (property_id, url, alt, is_primary) VALUES ${imagesValues}`)
      }

      await client.query('COMMIT')

      // Получаем обновленный объект
      const getQuery = `
        SELECT p.*, 
               COALESCE(
                 json_agg(
                   json_build_object(
                     'id', pi.id,
                     'url', pi.url,
                     'alt', pi.alt,
                     'is_primary', pi.is_primary
                   )
                 ) FILTER (WHERE pi.id IS NOT NULL),
                 '[]'
               ) as images,
               COALESCE(
                 json_agg(pf.feature) FILTER (WHERE pf.feature IS NOT NULL),
                 '[]'
               ) as features
        FROM properties p
        LEFT JOIN property_images pi ON p.id = pi.property_id
        LEFT JOIN property_features pf ON p.id = pf.property_id
        WHERE p.id = $1
        GROUP BY p.id
      `
      const updatedResult = await client.query(getQuery, [propertyId])
      const updatedProperty = updatedResult.rows[0]
      updatedProperty.images = updatedProperty.images || []
      updatedProperty.features = updatedProperty.features || []

      logger.info('Property updated successfully', { slug })
      return NextResponse.json({ success: true, data: updatedProperty })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    logger.error("Error updating property", error)
    return NextResponse.json(
      { success: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  logger.logApiCall(request.method, request.url, { params })
  
  try {
    const slug = params.slug

    // Сначала удаляем связанные изображения
    await pool.query("DELETE FROM property_images WHERE property_id IN (SELECT id FROM properties WHERE slug = $1)", [slug])

    // Затем удаляем сам объект
    const result = await pool.query("DELETE FROM properties WHERE slug = $1 RETURNING *", [slug])

    if (result.rows.length === 0) {
      logger.warn('Property not found for deletion', { slug })
      return NextResponse.json(
        { success: false, error: "Объект не найден" },
        { status: 404 }
      )
    }

    logger.info('Property deleted successfully', { slug })
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Error deleting property", error)
    return NextResponse.json(
      { success: false, error: "Ошибка при удалении объекта" },
      { status: 500 }
    )
  }
} 