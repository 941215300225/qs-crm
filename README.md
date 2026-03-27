# QS CRM — REST API сервис заявок

REST API для управления заявками на NestJS + PostgreSQL.

## Стек

- Node.js + TypeScript (strict)
- NestJS
- PostgreSQL + TypeORM
- Swagger / OpenAPI
- class-validator

## Запуск

### 1. Клонировать репозиторий

```bash
git clone <repo-url>
cd qs-crm
```

### 2. Настроить переменные окружения

```bash
cp .env.example .env
```

### 3. Запустить базу данных

```bash
docker-compose up -d
```

### 4. Установить зависимости и запустить сервер

```bash
npm install
npm run start:dev
```

Сервер запустится на http://localhost:3000

Swagger UI доступен по адресу: http://localhost:3000/api

---

## Пример .env

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=qs_crm

PORT=3000
```

---

## API endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| POST | /applications | Создать заявку |
| GET | /applications | Список заявок |
| GET | /applications/:id | Получить заявку |
| PATCH | /applications/:id | Обновить заявку |
| PATCH | /applications/:id/status | Изменить статус |

### Параметры списка (GET /applications)

| Параметр | Тип | Описание |
|----------|-----|----------|
| page | number | Страница (по умолчанию 1) |
| limit | number | Размер страницы (по умолчанию 10) |
| status | string | Фильтр по статусу: new, in_progress, won, lost |
| search | string | Поиск по имени и описанию |
| sortBy | string | Поле сортировки: createdAt, name, status |
| order | string | ASC или DESC |

### Статусы заявки

```
new → in_progress → won
                  → lost
```

- `won` и `lost` — финальные статусы, изменить нельзя
- Нельзя установить тот же статус что уже стоит
- При некорректном переходе возвращается `400 Bad Request`
