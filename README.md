# qs-crm

REST API сервис для управления заявками

## Стек

- NestJS + TypeScript
- PostgreSQL + TypeORM
- Swagger для документации
- Docker для базы данных

## Как запустить локально

Клон репозиторий:

```bash
git clone <repo-url>
cd qs-crm
```

Скопируй env файл и заполни под себя:

```bash
cp .env.example .env
```

Базу данных

```bash
docker-compose up -d
```

Установить зависимость и запустить

```bash
npm install
npm run start:dev
```

Сервер будет на http://localhost:3000

Swagger: http://localhost:3000/api

## Переменные окружения

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=qs_crm
PORT=3000
```

## API

| Метод | URL | Что делает |
|-------|-----|-----------|
| POST | /applications | Создать заявку |
| GET | /applications | Список заявок |
| GET | /applications/:id | Одна заявка |
| PATCH | /applications/:id | Обновить заявку |
| PATCH | /applications/:id/status | Поменять статус |

Список поддерживает пагинацию, фильтр по статусу, текстовый поиск и сортировку.

## Статусы заявки

Заявка всегда создаётся со статусом `new`. Дальше можно менять:

```
new → in_progress → won
                  → lost
```

`won` и `lost` — финальные, после них статус поменять нельзя. Если попытаться вернётся 400.

## Про структуру

Старался держать всё просто: контроллер принимает запросы, сервис содержит логику, entity описывает таблицу. Без лишних абстракций.
