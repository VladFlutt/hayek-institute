# Институт Хайека

Онлайн-школа по курсам лекций Павла Усанова: Next.js 16 + Payload CMS 3 (Postgres), интерфейс RU/EN, ИИ-тьютор.

## Доступ
- Первая лекция каждого курса открыта всем.
- Остальное открывается кодом доступа (`HAYEK-XXXX-XXXX-XXXX`), который создаётся в админке: **Коды доступа → Создать**. Код может открыть отдельные курсы или всю школу, у него задаются число активаций и срок.
- Первый зарегистрированный пользователь становится администратором.

## Переменные окружения (только в Vercel, не в репозитории)
| Имя | Назначение |
|---|---|
| `DATABASE_URL` | Postgres (Neon) |
| `PAYLOAD_SECRET` | секрет Payload |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob для картинок и PDF |
| `AI_PROVIDER` | `groq` (по умолчанию), `openrouter`, `mistral`, `gemini` |
| `AI_API_KEY` | ключ провайдера ИИ |
| `AI_MODEL`, `AI_BASE_URL` | необязательно, переопределяют пресет |

## Локально
```bash
cp .env.example .env   # заполнить DATABASE_URL и PAYLOAD_SECRET
pnpm install
pnpm payload migrate
pnpm seed              # каталог курсов; SEED_FORCE=1 перезапишет существующее
pnpm dev
```

## Деплой
Vercel запускает `vercel-build`: миграции, сид (только в пустую базу), затем `next build`.
После изменения коллекций: `pnpm payload migrate:create <имя>` и закоммитить файл миграции.
