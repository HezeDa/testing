import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import fs from "fs"
import path from "path"

export async function GET() {
  return NextResponse.json({
    message: "Для выполнения миграции используйте POST-запрос"
  })
}

export async function POST() {
  try {
    const client = await pool.connect()

    try {
      // Читаем SQL-скрипт
      const sqlPath = path.join(process.cwd(), "scripts", "update-properties-table.sql")
      const sql = fs.readFileSync(sqlPath, "utf8")

      // Выполняем SQL-скрипт
      await client.query(sql)

      return NextResponse.json({
        success: true,
        message: "Таблица properties успешно обновлена"
      })
    } catch (error) {
      console.error("Ошибка при выполнении миграции:", error)
      return NextResponse.json({
        success: false,
        error: "Ошибка при выполнении миграции",
        details: String(error)
      }, { status: 500 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Ошибка при подключении к базе данных:", error)
    return NextResponse.json({
      success: false,
      error: "Ошибка при подключении к базе данных",
      details: String(error)
    }, { status: 500 })
  }
} 