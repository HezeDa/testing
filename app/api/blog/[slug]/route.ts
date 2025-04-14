import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  logger.logApiCall('GET', `/api/blog/${params.slug}`, { params })
  
  try {
    const { slug } = params

    const query = `SELECT * FROM blog_articles WHERE slug = $1`
    logger.logDatabaseQuery(query, [slug])

    const result = await pool.query(query, [slug])

    logger.debug('Query result:', { 
      found: result.rows.length > 0,
      rowCount: result.rows.length 
    })

    if (result.rows.length === 0) {
      logger.warn('Article not found', { slug })
      return NextResponse.json(
        { success: false, error: "Статья не найдена" },
        { status: 404 }
      )
    }

    logger.info('Article retrieved successfully', { slug })
    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    logger.error("Error retrieving article", error)
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
  logger.logApiCall('PUT', `/api/blog/${params.slug}`, { params })
  
  try {
    const { slug } = params
    const data = await request.json()
    
    logger.debug('Update data:', data)

    const query = `UPDATE blog_articles 
       SET title = $1, slug = $2, excerpt = $3, content = $4, 
           category_id = $5, author_id = $6, status = $7,
           featured = $8, featured_image = $9, meta_title = $10,
           meta_description = $11, meta_keywords = $12
       WHERE slug = $13
       RETURNING *`
    
    const queryParams = [
      data.title,
      data.slug,
      data.excerpt,
      data.content,
      data.category_id,
      data.author_id,
      data.status,
      data.featured,
      data.featured_image,
      data.meta_title,
      data.meta_description,
      data.meta_keywords,
      slug
    ]

    logger.logDatabaseQuery(query, queryParams)

    const result = await pool.query(query, queryParams)

    logger.debug('Update result:', { 
      updated: result.rows.length > 0,
      rowCount: result.rows.length 
    })

    if (result.rows.length === 0) {
      logger.warn('Article not found for update', { slug })
      return NextResponse.json(
        { success: false, error: "Статья не найдена" },
        { status: 404 }
      )
    }

    logger.info('Article updated successfully', { slug })
    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    logger.error("Error updating article", error)
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
  logger.logApiCall('DELETE', `/api/blog/${params.slug}`, { params })
  
  try {
    const { slug } = params

    const query = `DELETE FROM blog_articles WHERE slug = $1 RETURNING *`
    logger.logDatabaseQuery(query, [slug])

    const result = await pool.query(query, [slug])

    logger.debug('Delete result:', { 
      deleted: result.rows.length > 0,
      rowCount: result.rows.length 
    })

    if (result.rows.length === 0) {
      logger.warn('Article not found for deletion', { slug })
      return NextResponse.json(
        { success: false, error: "Статья не найдена" },
        { status: 404 }
      )
    }

    logger.info('Article deleted successfully', { slug })
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Error deleting article", error)
    return NextResponse.json(
      { success: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
} 