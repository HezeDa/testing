import { Pool } from "pg"
import dotenv from "dotenv"

// Загружаем переменные окружения
dotenv.config()

// Создаем пул соединений
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}) 