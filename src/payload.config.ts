import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { AccessCodes } from './collections/AccessCodes'
import { Courses } from './collections/Courses'
import { Documents } from './collections/Documents'
import { Glossary } from './collections/Glossary'
import { Lessons } from './collections/Lessons'
import { Levels } from './collections/Levels'
import { Media } from './collections/Media'
import { Resources } from './collections/Resources'
import { Users } from './collections/Users'
import { AssistantCharter } from './globals/AssistantCharter'
import { redeemEndpoint } from './endpoints/redeem'
import { tutorEndpoint } from './endpoints/tutor'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Outgoing mail (password reset). Any SMTP works, e.g. Gmail with an app password:
// SMTP_HOST=smtp.gmail.com SMTP_PORT=465 SMTP_USER=you@gmail.com SMTP_PASS=<app password>
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM || process.env.SMTP_USER || '',
      defaultFromName: 'Институт Хайека',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: Number(process.env.SMTP_PORT || 465) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    })
  : undefined

export default buildConfig({
  email,
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' — Институт Хайека' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { supportedLanguages: { ru, en }, fallbackLanguage: 'ru' },
  localization: {
    locales: [
      { code: 'ru', label: 'Русский' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'ru',
    fallback: true,
  },
  collections: [Levels, Courses, Lessons, Resources, Glossary, AccessCodes, Users, Media, Documents],
  globals: [AssistantCharter],
  endpoints: [redeemEndpoint, tutorEndpoint],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.STORAGE_URL || '' },
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true, documents: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
    }),
  ],
})
