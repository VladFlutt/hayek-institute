import type { CollectionConfig } from 'payload'
import { anyone, editors } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: { ru: 'Изображение', en: 'Image' }, plural: { ru: 'Изображения', en: 'Images' } },
  admin: { group: { ru: 'Файлы', en: 'Files' } },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  fields: [{ name: 'alt', type: 'text', localized: true, label: { ru: 'Описание', en: 'Alt text' } }],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 640, height: 360, position: 'centre' },
      { name: 'hero', width: 1600, height: 900, position: 'centre' },
    ],
  },
}
