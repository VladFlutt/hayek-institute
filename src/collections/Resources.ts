import type { CollectionConfig } from 'payload'
import { anyone, editors } from '../access/roles'

export const Resources: CollectionConfig = {
  slug: 'resources',
  labels: { singular: { ru: 'Источник', en: 'Resource' }, plural: { ru: 'Библиотека', en: 'Library' } },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'kind', 'courses'],
    group: { ru: 'Учебная программа', en: 'Curriculum' },
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { ru: 'Название', en: 'Title' } },
    { name: 'author', type: 'text', localized: true, label: { ru: 'Автор', en: 'Author' } },
    {
      name: 'kind',
      type: 'select',
      defaultValue: 'book',
      label: { ru: 'Тип', en: 'Type' },
      options: [
        { label: { ru: 'Книга', en: 'Book' }, value: 'book' },
        { label: { ru: 'Статья', en: 'Article' }, value: 'article' },
        { label: { ru: 'Фильм / видео', en: 'Film / video' }, value: 'video' },
        { label: { ru: 'Задание', en: 'Assignment' }, value: 'homework' },
        { label: { ru: 'Другое', en: 'Other' }, value: 'other' },
      ],
    },
    { name: 'file', type: 'upload', relationTo: 'documents', label: { ru: 'Файл (PDF)', en: 'File (PDF)' } },
    { name: 'url', type: 'text', label: { ru: 'Ссылка', en: 'Link' }, admin: { description: 'Исходная ссылка (Google Drive, YouTube и т. п.)' } },
    { name: 'courses', type: 'relationship', relationTo: 'courses', hasMany: true, label: { ru: 'Курсы', en: 'Courses' } },
    { name: 'note', type: 'textarea', localized: true, label: { ru: 'Комментарий', en: 'Note' } },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
