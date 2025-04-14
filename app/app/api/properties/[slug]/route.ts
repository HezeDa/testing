import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  logger.logApiCall('GET', `/api/properties/${params.slug}`, { params })
  
  try {
    const { slug } = params

    const query = `SELECT * FROM properties WHERE slug = $1`
    logger.logDatabaseQuery(query, [slug])

    const result = await pool.query(query, [slug])

    logger.debug('Query result:', { 
      found: result.rows.length > 0,
      rowCount: result.rows.length 
    })

    if (result.rows.length === 0) {
      logger.warn('Property not found', { slug })
      return NextResponse.json(
        { success: false, error: "Объект не найден" },
        { status: 404 }
      )
    }

    logger.info('Property retrieved successfully', { slug })
    return NextResponse.json({ success: true, data: result.rows[0] })
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
  logger.logApiCall('PUT', `/api/properties/${params.slug}`, { params })
  
  try {
    const { slug } = params
    const data = await request.json()
    
    logger.debug('Update data:', data)

    const query = `UPDATE properties 
       SET title = $1, slug = $2, description = $3, location = $4, 
           region = $5, price = $6, type = $7, status = $8,
           bedrooms = $9, bathrooms = $10, area = $11, featured = $12
       WHERE slug = $13
       RETURNING *`
    
    const queryParams = [
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

    logger.logDatabaseQuery(query, queryParams)

    const result = await pool.query(query, queryParams)

    logger.debug('Update result:', { 
      updated: result.rows.length > 0,
      rowCount: result.rows.length 
    })

    if (result.rows.length === 0) {
      logger.warn('Property not found for update', { slug })
      return NextResponse.json(
        { success: false, error: "Объект не найден" },
        { status: 404 }
      )
    }

    logger.info('Property updated successfully', { slug })
    return NextResponse.json({ success: true, data: result.rows[0] })
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
  logger.logApiCall('DELETE', `/api/properties/${params.slug}`, { params })
  
  try {
    const { slug } = params

    const query = `DELETE FROM properties WHERE slug = $1 RETURNING *`
    logger.logDatabaseQuery(query, [slug])

    const result = await pool.query(query, [slug])

    logger.debug('Delete result:', { 
      deleted: result.rows.length > 0,
      rowCount: result.rows.length 
    })

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
      { success: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
} 