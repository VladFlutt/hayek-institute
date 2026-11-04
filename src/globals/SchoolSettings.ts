import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access/roles'

export const SchoolSettings: GlobalConfig = {
  slug: 'school-settings',
  label: { ru: 'Настройки школы', en: 'School settings' },
  access: { read: anyone, update: adminOnly },
  fields: [
    {
      name: 'adminContact',
      type: 'text',
      label: { ru: 'Контакт администратора', en: 'Administrator contact' },
      admin: {
        description: {
          ru: 'Email или ссылка (например, https://t.me/имя). Показывается ученику, который забыл пароль.',
          en: 'Email or link (e.g. https://t.me/name). Shown to a student who forgot the password.',
        },
      },
    },
  ],
}
