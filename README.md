# Real Estate Management System

Система управления недвижимостью с современным интерфейсом и полным набором функций для администраторов и пользователей.

## 🚀 Основные возможности

- 📱 Адаптивный дизайн
- 🔐 Аутентификация и авторизация
- 🏠 Управление объектами недвижимости
- 📸 Загрузка и управление изображениями
- 🔍 Фильтрация и поиск объектов
- 📊 Административная панель
- 🌐 Мультиязычность (русский/английский)

## 🛠 Технологии

- **Frontend:**
  - Next.js 14
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui
  - React Query
  - React Hook Form
  - Zod

- **Backend:**
  - Next.js API Routes
  - PostgreSQL
  - Prisma ORM
  - JWT аутентификация

## 📋 Требования

- Node.js 18+
- PostgreSQL 14+
- npm или yarn

## 🚀 Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/real-estate-system.git
cd real-estate-system
```

2. Установите зависимости:
```bash
npm install
# или
yarn install
```

3. Создайте файл `.env` в корне проекта:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/database"
JWT_SECRET="your-secret-key"
UPLOAD_DIR="./public/uploads"
```

4. Инициализируйте базу данных:
```bash
npm run db:init
# или
yarn db:init
```

5. Запустите проект в режиме разработки:
```bash
npm run dev
# или
yarn dev
```

## 🏗 Структура проекта

```
├── app/                    # Next.js app directory
│   ├── admin/             # Административная панель
│   ├── api/               # API endpoints
│   ├── auth/              # Страницы аутентификации
│   └── properties/        # Страницы объектов
├── components/            # React компоненты
├── lib/                   # Утилиты и конфигурации
├── public/                # Статические файлы
└── styles/                # Глобальные стили
```

## 🔧 Настройка базы данных

1. Создайте базу данных PostgreSQL
2. Настройте подключение в `.env`
3. Запустите миграции:
```bash
npm run db:migrate
# или
yarn db:migrate
```

## 📦 Деплой

### Vercel (Рекомендуемый вариант)

1. Создайте аккаунт на [Vercel](https://vercel.com)
2. Подключите GitHub репозиторий
3. Настройте переменные окружения:
   - DATABASE_URL
   - JWT_SECRET
   - UPLOAD_DIR
4. Запустите деплой

### Другие варианты

- Railway
- DigitalOcean
- AWS

Подробные инструкции по деплою смотрите в [документации по деплою](./docs/DEPLOYMENT.md).

## 📚 Документация

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Component Library](./docs/COMPONENTS.md)

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'Add amazing feature'`)
4. Запушьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Лицензия

Этот проект лицензирован под MIT License - смотрите файл [LICENSE](./LICENSE) для деталей.

## 📞 Контакты

- Email: your-email@example.com
- Website: https://your-website.com

## 🙏 Благодарности

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Prisma](https://prisma.io) 