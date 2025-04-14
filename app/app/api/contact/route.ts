import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("Получен запрос на создание заявки")
    const data = await request.json()
    console.log("Данные запроса:", data)
    const { name, email, phone, message, type = "general" } = data

    // Валидация данных
    if (!name || !email || !message) {
      console.log("Ошибка валидации: отсутствуют обязательные поля")
      return NextResponse.json(
        { error: "Пожалуйста, заполните все обязательные поля" },
        { status: 400 }
      )
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("Ошибка валидации: некорректный email")
      return NextResponse.json(
        { error: "Пожалуйста, введите корректный email" },
        { status: 400 }
      )
    }

    console.log("Попытка подключения к базе данных")
    // Сохранение в базу данных
    const result = await pool.query(
      `INSERT INTO contact_requests (name, email, phone, message, type, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'new', NOW(), NOW())
       RETURNING id`,
      [name, email, phone, message, type]
    )
    console.log("Заявка успешно создана, ID:", result.rows[0].id)

    // Отправка уведомления администратору (можно добавить позже)
    // await sendNotificationEmail({ name, email, phone, message, type })

    return NextResponse.json(
      { 
        success: true, 
        message: "Ваше сообщение успешно отправлено",
        requestId: result.rows[0].id
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Ошибка при обработке формы:", error)
    return NextResponse.json(
      { error: "Произошла ошибка при отправке формы" },
      { status: 500 }
    )
  }
} 