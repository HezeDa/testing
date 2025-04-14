import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { inquiries, properties } from "@/lib/schema"
import { eq } from "drizzle-orm"
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
    let query = db
      .select({
        inquiry: inquiries,
        property: {
          id: properties.id,
          title: properties.title,
        },
      })
      .from(inquiries)
      .leftJoin(properties, eq(inquiries.propertyId, properties.id))

    // Применение фильтров
    if (status) {
      query = query.where(eq(inquiries.status, status as any))
    }

    const result = await query

    // Преобразование результатов в удобный формат
    const inquiriesList = result.map(({ inquiry, property }) => ({
      ...inquiry,
      property: property.id ? property : null,
    }))

    return NextResponse.json(inquiriesList)
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }
}

// POST /api/inquiries - создание новой заявки
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Валидация данных
    const validatedData = inquirySchema.parse(body)

    // Создание заявки
    const [newInquiry] = await db
      .insert(inquiries)
      .values({
        ...validatedData,
        status: "new",
      })
      .returning()

    // Здесь можно добавить отправку уведомления на email

    return NextResponse.json(newInquiry, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating inquiry:", error)
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 })
  }
}
