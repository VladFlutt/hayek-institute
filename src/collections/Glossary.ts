import type { CollectionConfig } from 'payload'
import { anyone, staffOnly } from '../access/roles'

export const Glossary: CollectionConfig = {
  slug: 'glossary',
  labels: { singular: { ru: 'Термин', en: 'Term' }, plural: { ru: 'Глоссарий', en: 'Glossary' } },
  admin: { useAsTitle: 'term', group: { ru: 'Учебная программа', en: 'Curriculum' } },
  defaultSort: 'term',
  access: { read: anyone, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'term', type: 'text', required: true, localized: true, label: { ru: 'Термин', en: 'Term' } },
    { name: 'definition', type: 'textarea', required: true, localized: true, label: { ru: 'Определение', en: 'Definition' } },
    { name: 'source', type: 'text', localized: true, label: { ru: 'Автор понятия / источник', en: 'Source' } },
  ],
}
