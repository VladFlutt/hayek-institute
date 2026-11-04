import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access/roles'
import { DEFAULT_CHARTER_RU, DEFAULT_CHARTER_EN } from '../lib/charter'

export const AssistantCharter: GlobalConfig = {
  slug: 'assistant-charter',
  label: { ru: 'Хартия ИИ-наставника', en: 'AI tutor charter' },
  admin: { group: { ru: 'ИИ-наставник', en: 'AI tutor' } },
  access: { read: anyone, update: adminOnly },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      label: { ru: 'Наставник включён', en: 'Tutor enabled' },
    },
    {
      name: 'dailyLimit',
      type: 'number',
      defaultValue: 30,
      label: { ru: 'Сообщений в день на слушателя', en: 'Messages per student per day' },
    },
    {
      name: 'charter',
      type: 'textarea',
      localized: true,
      admin: { rows: 30, description: 'Принципы и правила, по которым отвечает наставник. Пустое поле = текст по умолчанию.' },
      label: { ru: 'Текст Хартии', en: 'Charter text' },
    },
  ],
  hooks: {
    afterRead: [
      ({ doc, req }) => {
        if (!doc.charter) doc.charter = req.locale === 'en' ? DEFAULT_CHARTER_EN : DEFAULT_CHARTER_RU
        return doc
      },
    ],
  },
}
