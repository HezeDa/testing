import { pool } from '../lib/db';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

async function initAdminsTable() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Читаем SQL файл
    const sqlPath = path.join(__dirname, 'create-admins-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Выполняем SQL скрипт
    await client.query(sql);
    
    // Добавляем начального администратора
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(
      `INSERT INTO admins (name, email, phone, password)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['Администратор', 'admin@example.com', '+7 (999) 123-45-67', hashedPassword]
    );
    
    await client.query('COMMIT');
    console.log('Таблица администраторов успешно создана и инициализирована');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Ошибка при создании таблицы администраторов:', error);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}

initAdminsTable(); 