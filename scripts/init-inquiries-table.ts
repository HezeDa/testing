import { pool } from "./db"
import fs from "fs"
import path from "path"

async function initInquiriesTable() {
  const client = await pool.connect()
  
  try {
    // Начинаем транзакцию
    await client.query("BEGIN")

    // Читаем SQL-файл
    const sqlPath = path.join(process.cwd(), "scripts", "create-inquiries-table.sql")
    const sql = fs.readFileSync(sqlPath, "utf8")

    // Выполняем SQL-скрипт
    await client.query(sql)

    // Завершаем транзакцию
    await client.query("COMMIT")
    console.log("Таблица заявок успешно создана")
  } catch (error) {
    // Откатываем транзакцию в случае ошибки
    await client.query("ROLLBACK")
    console.error("Ошибка при создании таблицы заявок:", error)
    throw error
  } finally {
    // Освобождаем клиента
    client.release()
  }
}

// Запускаем инициализацию
initInquiriesTable()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 