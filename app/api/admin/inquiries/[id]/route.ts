import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { inquiries, properties } from "@/lib/schema"
import { eq } from "drizzle-orm"
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
    const result = await db
      .select({
        inquiry: inquiries,
        property: {
          id: properties.id,
          title: properties.title,
        },
      })
      .from(inquiries)
      .leftJoin(properties, eq(inquiries.propertyId, properties.id))
      .where(eq(inquiries.id, id))
      .then((res) => res[0])

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
      ...result.inquiry,
      property: result.property.id ? result.property : null,
    }

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
    const existingInquiry = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.id, id))
      .then((res) => res[0])

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
    const [updatedInquiry] = await db
      .update(inquiries)
      .set({
        status: validatedData.status,
        updatedAt: new Date(),
      })
      .where(eq(inquiries.id, id))
      .returning()

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
    const existingInquiry = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.id, id))
      .then((res) => res[0])

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
    await db.delete(inquiries).where(eq(inquiries.id, id))

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