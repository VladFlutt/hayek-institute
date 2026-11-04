import type { CollectionConfig } from 'payload'
import { anyone, editors } from '../access/roles'

export const Levels: CollectionConfig = {
  slug: 'levels',
  labels: { singular: { ru: 'Ступень', en: 'Level' }, plural: { ru: 'Ступени', en: 'Levels' } },
  admin: { useAsTitle: 'title', defaultColumns: ['order', 'title'], group: { ru: 'Учебная программа', en: 'Curriculum' } },
  defaultSort: 'order',
  access: { read: anyone, create: editors, update: editors, delete: editors },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { ru: 'Название', en: 'Title' } },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' }, label: { ru: 'Порядок', en: 'Order' } },
    { name: 'description', type: 'textarea', localized: true, label: { ru: 'Описание', en: 'Description' } },
    { name: 'cover', type: 'upload', relationTo: 'media', label: { ru: 'Обложка', en: 'Cover' } },
  ],
}
