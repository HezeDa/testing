import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  try {
    // Получаем статистику по недвижимости
    const propertiesStats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN featured = true THEN 1 ELSE 0 END) as featured,
        AVG(price) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM properties
    `)

    // Получаем статистику по блогу
    const blogStats = await pool.query(`
      SELECT 
        COUNT(*) as total_articles,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN featured = true THEN 1 ELSE 0 END) as featured,
        COUNT(DISTINCT category_id) as categories
      FROM blog_articles
    `)

    // Получаем последние добавленные объекты недвижимости
    const recentProperties = await pool.query(`
      SELECT p.*, pi.url as image_url
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = true
      ORDER BY p.created_at DESC
      LIMIT 5
    `)

    // Получаем последние статьи блога
    const recentArticles = await pool.query(`
      SELECT a.*, c.name as category_name, u.name as author_name
      FROM blog_articles a
      LEFT JOIN blog_categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.author_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 5
    `)

    return NextResponse.json({
      success: true,
      data: {
        properties: {
          stats: propertiesStats.rows[0],
          recent: recentProperties.rows
        },
        blog: {
          stats: blogStats.rows[0],
          recent: recentArticles.rows
        }
      }
    })

  } catch (error) {
    console.error("Ошибка при получении данных дашборда:", error)
    return NextResponse.json({
      success: false,
      error: "Ошибка при получении данных дашборда",
      details: String(error)
    }, { status: 500 })
  }
} 