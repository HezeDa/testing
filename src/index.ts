import { config } from 'dotenv'
import { db } from '../lib/db'

// Загружаем переменные окружения
config({ path: '.env.local' })

async function main() {
  try {
    console.log('🚀 Запуск приложения...')
    
    // Проверяем подключение к хранилищу
    const isConnected = await db.users.findFirst({
      where: { email: 'admin@cypruseliteestates.com' }
    })
    
    if (isConnected) {
      console.log('✅ Администратор найден')
    } else {
      console.log('❌ Администратор не найден')
    }
    
    console.log('✅ Приложение успешно запущено')
  } catch (error) {
    console.error('❌ Ошибка при запуске приложения:', error)
  }
}

main() 