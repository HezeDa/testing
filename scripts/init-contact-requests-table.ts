import { pool } from "@/lib/db"
import fs from "fs"
import path from "path"

async function initContactRequestsTable() {
  const client = await pool.connect()
  
  try {
    // Начинаем транзакцию
    await client.query("BEGIN")

    // Читаем SQL-файл
    const sqlPath = path.join(process.cwd(), "scripts", "create-contact-requests-table.sql")
    const sql = fs.readFileSync(sqlPath, "utf8")

    // Выполняем SQL-скрипт
    await client.query(sql)

    // Завершаем транзакцию
    await client.query("COMMIT")
    console.log("Таблица contact_requests успешно создана")
  } catch (error) {
    // Откатываем транзакцию в случае ошибки
    await client.query("ROLLBACK")
    console.error("Ошибка при создании таблицы contact_requests:", error)
    process.exit(1)
  } finally {
    // Освобождаем клиента
    client.release()
    process.exit(0)
  }
}

// Запускаем инициализацию
initContactRequestsTable() 