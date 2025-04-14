import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { z } from "zod"

// Схема валидации для обновления заявки
const updateInquirySchema = z.object({
  status: z.enum(["new", "in-progress", "completed"]),
})

// GET /api/admin/inquiries/[id] - получение заявки по ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Получение заявки с информацией о связанном объекте недвижимости
    const result = await pool
      .query(
        `SELECT i.*, p.id as "propertyId", p.title as "propertyTitle"
         FROM inquiries i
         LEFT JOIN properties p ON i."propertyId" = p.id
         WHERE i.id = $1`,
        [id]
      )
      .then((res) => res.rows[0])

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: "Заявка не найдена",
        },
        { status: 404 },
      )
    }

    // Преобразование результата в удобный формат
    const inquiry = {
      ...result,
      property: result.propertyId ? {
        id: result.propertyId,
        title: result.propertyTitle
      } : null
    }

    // Удаляем лишние поля
    delete inquiry.propertyId
    delete inquiry.propertyTitle

    return NextResponse.json({
      success: true,
      data: inquiry,
    })
  } catch (error) {
    console.error("Error fetching inquiry:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при загрузке заявки",
      },
      { status: 500 },
    )
  }
}

// PATCH /api/admin/inquiries/[id] - обновление статуса заявки
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    // Валидация данных
    const validatedData = updateInquirySchema.parse(body)

    // Проверка существования заявки
    const existingInquiry = await pool
      .query('SELECT * FROM inquiries WHERE id = $1', [id])
      .then((res) => res.rows[0])

    if (!existingInquiry) {
      return NextResponse.json(
        {
          success: false,
          error: "Заявка не найдена",
        },
        { status: 404 },
      )
    }

    // Обновление статуса заявки
    const [updatedInquiry] = await pool
      .query(
        `UPDATE inquiries 
         SET status = $1, "updatedAt" = NOW()
         WHERE id = $2
         RETURNING *`,
        [validatedData.status, id]
      )
      .then((res) => res.rows)

    return NextResponse.json({
      success: true,
      data: updatedInquiry,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Некорректные данные для обновления",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    console.error("Error updating inquiry:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при обновлении заявки",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/admin/inquiries/[id] - удаление заявки
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Проверка существования заявки
    const existingInquiry = await pool
      .query('SELECT * FROM inquiries WHERE id = $1', [id])
      .then((res) => res.rows[0])

    if (!existingInquiry) {
      return NextResponse.json(
        {
          success: false,
          error: "Заявка не найдена",
        },
        { status: 404 },
      )
    }

    // Удаление заявки
    await pool.query('DELETE FROM inquiries WHERE id = $1', [id])

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Error deleting inquiry:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при удалении заявки",
      },
      { status: 500 },
    )
  }
} 