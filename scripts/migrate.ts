import { Pool } from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'

const pool = new Pool({
  host: 'pg-3b4de346-tricion219-17b2.k.aivencloud.com',
  port: 12372,
  database: 'defaultdb',
  user: 'avnadmin',
  password: 'AVNS_Diaaf8DAEjsaaMSXdGf',
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20
})

async function migrate() {
  const client = await pool.connect()
  
  try {
    // Читаем SQL файл
    const sqlPath = join(__dirname, 'migrate-properties.sql')
    const sqlContent = readFileSync(sqlPath, 'utf-8')

    // Начинаем транзакцию
    await client.query('BEGIN')

    try {
      // Выполняем SQL-скрипт
      await client.query(sqlContent)
      
      // Подтверждаем транзакцию
      await client.query('COMMIT')
      
      console.log('Миграция успешно выполнена!')
    } catch (error) {
      // Откатываем транзакцию в случае ошибки
      await client.query('ROLLBACK')
      console.error('Ошибка при выполнении миграции:', error)
      throw error
    }
  } finally {
    // Освобождаем клиент
    client.release()
  }
}

// Запускаем миграцию
migrate()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Ошибка:', error)
    process.exit(1)
  }) 