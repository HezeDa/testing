import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  try {
    // Получаем количество объектов недвижимости
    const result = await pool.query("SELECT COUNT(*) as value FROM properties")
    const propertiesCount = parseInt(result.rows[0].value)

    return NextResponse.json({ 
      success: true,
      data: { count: propertiesCount }
    })
  } catch (error) {
    console.error("Error fetching properties count:", error)
    return NextResponse.json({ 
      success: false,
      error: "Ошибка при получении количества объектов" 
    }, { status: 500 })
  }
}
