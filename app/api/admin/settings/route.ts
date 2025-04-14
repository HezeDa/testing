import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { z } from "zod"

// Схема валидации для настроек
const settingsSchema = z.object({
  // Основные настройки
  site_name: z.string().min(1, "Название сайта обязательно"),
  meta_description: z.string().nullable(),
  meta_keywords: z.string().nullable(),
  maintenance_mode: z.boolean(),

  // Контактная информация
  contact_email: z.string().email("Неверный формат email").min(1, "Email обязателен"),
  contact_phone: z.string().min(1, "Телефон обязателен"),
  address: z.string().min(1, "Адрес обязателен"),
  working_hours: z.string().nullable(),
  
  // Социальные сети
  facebook_url: z.string().url("Неверный формат URL").nullable(),
  instagram_url: z.string().url("Неверный формат URL").nullable(),
  whatsapp_number: z.string().nullable(),
  
  // Шапка сайта
  header_phone: z.string().min(1, "Телефон в шапке обязателен"),
  header_email: z.string().email("Неверный формат email").min(1, "Email в шапке обязателен"),
  show_social_in_header: z.boolean(),
  
  // Подвал сайта
  footer_description: z.string().nullable(),
  footer_copyright: z.string().nullable(),
  show_social_in_footer: z.boolean(),
  show_contact_in_footer: z.boolean(),
  show_working_hours_in_footer: z.boolean(),
})

// GET /api/admin/settings - получение настроек
export async function GET() {
  try {
    const client = await pool.connect()

    try {
      const result = await client.query("SELECT * FROM settings LIMIT 1")
      const settings = result.rows[0]

      return NextResponse.json({ success: true, data: settings })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { success: false, error: "Ошибка при загрузке настроек" },
      { status: 500 }
    )
  }
}

// POST /api/admin/settings - обновление настроек
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Полученные данные:", body)

    const validatedData = settingsSchema.parse(body)
    console.log("Валидированные данные:", validatedData)

    const client = await pool.connect()

    try {
      let result

      // Проверяем, существует ли запись
      const existingSettings = await client.query("SELECT id FROM settings LIMIT 1")

      if (existingSettings.rows.length === 0) {
        // Создаем новую запись
        result = await client.query(
          `
          INSERT INTO settings (
            site_name, meta_description, meta_keywords, maintenance_mode,
            contact_email, contact_phone, address, working_hours,
            facebook_url, instagram_url, whatsapp_number,
            header_phone, header_email, show_social_in_header,
            footer_description, footer_copyright,
            show_social_in_footer, show_contact_in_footer, show_working_hours_in_footer
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          RETURNING *
          `,
          [
            validatedData.site_name,
            validatedData.meta_description,
            validatedData.meta_keywords,
            validatedData.maintenance_mode,
            validatedData.contact_email,
            validatedData.contact_phone,
            validatedData.address,
            validatedData.working_hours,
            validatedData.facebook_url,
            validatedData.instagram_url,
            validatedData.whatsapp_number,
            validatedData.header_phone,
            validatedData.header_email,
            validatedData.show_social_in_header,
            validatedData.footer_description,
            validatedData.footer_copyright,
            validatedData.show_social_in_footer,
            validatedData.show_contact_in_footer,
            validatedData.show_working_hours_in_footer,
          ]
        )
      } else {
        // Обновляем существующую запись
        result = await client.query(
          `
          UPDATE settings
          SET
            site_name = $1,
            meta_description = $2,
            meta_keywords = $3,
            maintenance_mode = $4,
            contact_email = $5,
            contact_phone = $6,
            address = $7,
            working_hours = $8,
            facebook_url = $9,
            instagram_url = $10,
            whatsapp_number = $11,
            header_phone = $12,
            header_email = $13,
            show_social_in_header = $14,
            footer_description = $15,
            footer_copyright = $16,
            show_social_in_footer = $17,
            show_contact_in_footer = $18,
            show_working_hours_in_footer = $19,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $20
          RETURNING *
          `,
          [
            validatedData.site_name,
            validatedData.meta_description,
            validatedData.meta_keywords,
            validatedData.maintenance_mode,
            validatedData.contact_email,
            validatedData.contact_phone,
            validatedData.address,
            validatedData.working_hours,
            validatedData.facebook_url,
            validatedData.instagram_url,
            validatedData.whatsapp_number,
            validatedData.header_phone,
            validatedData.header_email,
            validatedData.show_social_in_header,
            validatedData.footer_description,
            validatedData.footer_copyright,
            validatedData.show_social_in_footer,
            validatedData.show_contact_in_footer,
            validatedData.show_working_hours_in_footer,
            existingSettings.rows[0].id,
          ]
        )
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Ошибка при сохранении настроек",
      },
      { status: 500 }
    )
  }
} 