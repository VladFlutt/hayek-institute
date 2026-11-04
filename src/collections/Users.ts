import type { CollectionConfig } from 'payload'
import { adminField, hasRole, isStaff } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: { ru: 'Пользователь', en: 'User' }, plural: { ru: 'Пользователи', en: 'Users' } },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'allAccess'],
    group: { ru: 'Слушатели и доступ', en: 'Students & access' },
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30,
    cookies: { sameSite: 'Lax' },
    forgotPassword: {
      expiration: 60 * 60 * 1000,
      generateEmailSubject: ({ user } = {}) =>
        (user as { locale?: string })?.locale === 'en' ? 'Password reset — Hayek Institute' : 'Восстановление пароля — Институт Хайека',
      generateEmailHTML: ({ req, token, user } = {}) => {
        const locale = (user as { locale?: string })?.locale === 'en' ? 'en' : 'ru'
        const base = process.env.NEXT_PUBLIC_SERVER_URL || req?.headers?.get('origin') || ''
        const url = `${base}/${locale}/reset?token=${encodeURIComponent(String(token))}`
        return locale === 'en'
          ? `<p>Someone asked to reset the password for your Hayek Institute account.</p><p><a href="${url}">Set a new password</a> (the link works for one hour).</p><p>If it was not you, just ignore this email.</p>`
          : `<p>Кто-то запросил смену пароля для вашего аккаунта в Институте Хайека.</p><p><a href="${url}">Задать новый пароль</a> (ссылка действует час).</p><p>Если это были не вы, просто проигнорируйте письмо.</p>`
      },
    },
  },
  access: {
    // Only staff can open the admin panel
    admin: ({ req }) => isStaff(req),
    // Anyone can register (role is forced to "student" by the hook below)
    create: () => true,
    read: ({ req }) => {
      if (isStaff(req)) return true
      if (req.user) return { id: { equals: req.user.id } }
      return false
    },
    update: ({ req }) => {
      if (hasRole(req, 'admin')) return true
      if (req.user) return { id: { equals: req.user.id } }
      return false
    },
    delete: ({ req }) => hasRole(req, 'admin'),
  },
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // The very first account becomes admin; everyone else self-registers as student.
        if (operation === 'create' && !hasRole(req, 'admin')) {
          const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
          data.role = totalDocs === 0 ? 'admin' : 'student'
          data.allAccess = false
          data.unlockedCourses = []
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: { ru: 'Имя', en: 'Name' } },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'student',
      saveToJWT: true,
      access: { update: adminField },
      label: { ru: 'Роль', en: 'Role' },
      options: [
        { label: { ru: 'Администратор', en: 'Admin' }, value: 'admin' },
        { label: { ru: 'Редактор', en: 'Editor' }, value: 'editor' },
        { label: { ru: 'Переводчик', en: 'Translator' }, value: 'translator' },
        { label: { ru: 'Слушатель', en: 'Student' }, value: 'student' },
      ],
    },
    {
      name: 'allAccess',
      type: 'checkbox',
      defaultValue: false,
      access: { update: adminField },
      label: { ru: 'Доступ ко всем курсам', en: 'Access to all courses' },
    },
    {
      name: 'unlockedCourses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      access: { update: adminField },
      label: { ru: 'Открытые курсы', en: 'Unlocked courses' },
    },
    {
      name: 'tutorUsage',
      type: 'group',
      admin: { readOnly: true },
      access: { update: adminField },
      label: { ru: 'ИИ-наставник: использование', en: 'AI tutor usage' },
      fields: [
        { name: 'day', type: 'text' },
        { name: 'count', type: 'number', defaultValue: 0 },
      ],
    },
    {
      name: 'locale',
      type: 'select',
      defaultValue: 'ru',
      options: ['ru', 'en'],
      label: { ru: 'Язык интерфейса', en: 'Interface language' },
    },
  ],
}
