import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { z } from "zod"

// Схема валидации для создания заявки
const inquirySchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string(),
  propertyId: z.number().optional(),
})

// GET /api/inquiries - получение списка заявок
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Параметры фильтрации
    const status = searchParams.get("status")

    // Базовый запрос
    let query = `
      SELECT 
        i.*,
        p.id as "propertyId",
        p.title as "propertyTitle"
      FROM inquiries i
      LEFT JOIN properties p ON i."propertyId" = p.id
    `
    const queryParams: any[] = []
    let paramCount = 1

    // Применение фильтров
    if (status) {
      query += ` WHERE i.status = $${paramCount}`
      queryParams.push(status)
      paramCount++
    }

    query += " ORDER BY i.created_at DESC"

    const result = await pool.query(query, queryParams)

    // Преобразование результатов в удобный формат
    const inquiriesList = result.rows.map(row => ({
      ...row,
      property: row.propertyId ? {
        id: row.propertyId,
        title: row.propertyTitle
      } : null
    }))

    // Удаляем лишние поля
    inquiriesList.forEach(inquiry => {
      delete inquiry.propertyId
      delete inquiry.propertyTitle
    })

    return NextResponse.json({
      success: true,
      data: inquiriesList
    })
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Ошибка при получении списка заявок" 
      }, 
      { status: 500 }
    )
  }
}

// POST /api/inquiries - создание новой заявки
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Валидация данных
    const validatedData = inquirySchema.parse(body)

    // Создание заявки
    const [newInquiry] = await pool
      .query(
        `INSERT INTO inquiries (
          name, email, phone, subject, message, 
          "propertyId", status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING *`,
        [
          validatedData.name,
          validatedData.email,
          validatedData.phone,
          validatedData.subject,
          validatedData.message,
          validatedData.propertyId,
          "new"
        ]
      )
      .then(res => res.rows)

    // Здесь можно добавить отправку уведомления на email

    return NextResponse.json({
      success: true,
      data: newInquiry
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false,
          error: "Некорректные данные",
          details: error.errors 
        }, 
        { status: 400 }
      )
    }

    console.error("Error creating inquiry:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Ошибка при создании заявки" 
      }, 
      { status: 500 }
    )
  }
}
