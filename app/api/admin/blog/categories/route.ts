import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM blog_categories
      ORDER BY name ASC
    `)

    return NextResponse.json({
      success: true,
      data: rows
    })

  } catch (error) {
    console.error("Ошибка при получении категорий:", error)
    return NextResponse.json({
      success: false,
      error: "Ошибка при получении категорий",
      details: String(error)
    }, { status: 500 })
  }
} 