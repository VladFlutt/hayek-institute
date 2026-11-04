import type { CollectionConfig } from 'payload'
import { adminOnly, hasRole } from '../access/roles'

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I to avoid typos

export const generateCode = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(12))
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length])
  return `HAYEK-${chars.slice(0, 4).join('')}-${chars.slice(4, 8).join('')}-${chars.slice(8, 12).join('')}`
}

export const normalizeCode = (raw: string) => raw.trim().toUpperCase().replace(/\s+/g, '')

export const AccessCodes: CollectionConfig = {
  slug: 'access-codes',
  labels: { singular: { ru: 'Код доступа', en: 'Access code' }, plural: { ru: 'Коды доступа', en: 'Access codes' } },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'scope', 'courses', 'uses', 'maxUses', 'buyer', 'createdAt'],
    group: { ru: 'Слушатели и доступ', en: 'Students & access' },
    description: 'Код продаётся отдельно. Слушатель вводит его на сайте, и ему открываются курсы. Оставьте поле «Код» пустым, чтобы он сгенерировался сам.',
  },
  access: { read: adminOnly, create: adminOnly, update: adminOnly, delete: adminOnly },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data) data.code = data.code ? normalizeCode(data.code) : generateCode()
        return data
      },
    ],
  },
  fields: [
    { name: 'code', type: 'text', unique: true, index: true, label: { ru: 'Код', en: 'Code' } },
    {
      name: 'scope',
      type: 'radio',
      defaultValue: 'courses',
      required: true,
      label: { ru: 'Что открывает', en: 'Unlocks' },
      options: [
        { label: { ru: 'Выбранные курсы', en: 'Selected courses' }, value: 'courses' },
        { label: { ru: 'Все курсы школы', en: 'All courses' }, value: 'all' },
      ],
    },
    {
      name: 'courses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      label: { ru: 'Курсы', en: 'Courses' },
      admin: { condition: (_, s) => s?.scope === 'courses' },
    },
    {
      type: 'row',
      fields: [
        { name: 'maxUses', type: 'number', defaultValue: 1, min: 1, required: true, label: { ru: 'Сколько активаций', en: 'Max activations' } },
        { name: 'uses', type: 'number', defaultValue: 0, admin: { readOnly: true }, label: { ru: 'Использовано', en: 'Used' } },
        { name: 'expiresAt', type: 'date', label: { ru: 'Действует до', en: 'Expires' } },
      ],
    },
    { name: 'buyer', type: 'text', label: { ru: 'Покупатель / заметка', en: 'Buyer / note' } },
    {
      name: 'redeemedBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: { readOnly: true },
      access: { update: ({ req }) => hasRole(req, 'admin') },
      label: { ru: 'Кто активировал', en: 'Redeemed by' },
    },
  ],
}
