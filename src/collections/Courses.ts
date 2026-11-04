import type { CollectionConfig } from 'payload'
import { editors, publishedOrStaff } from '../access/roles'

export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: { singular: { ru: 'Курс', en: 'Course' }, plural: { ru: 'Курсы', en: 'Courses' } },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'level', 'year', '_status'],
    group: { ru: 'Учебная программа', en: 'Curriculum' },
  },
  defaultSort: 'order',
  versions: { drafts: true, maxPerDoc: 30 },
  access: { read: publishedOrStaff, create: editors, update: editors, delete: editors },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { ru: 'Название', en: 'Title' } },
    {
      type: 'row',
      fields: [
        { name: 'slug', type: 'text', required: true, unique: true, index: true },
        { name: 'level', type: 'relationship', relationTo: 'levels', required: true, label: { ru: 'Ступень', en: 'Level' } },
        { name: 'order', type: 'number', defaultValue: 0, label: { ru: 'Порядок', en: 'Order' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'year', type: 'text', label: { ru: 'Когда читался', en: 'When taught' }, localized: true },
        { name: 'teacher', type: 'text', defaultValue: 'Павел Усанов', localized: true, label: { ru: 'Преподаватель', en: 'Teacher' } },
      ],
    },
    { name: 'tagline', type: 'text', localized: true, label: { ru: 'Короткое описание', en: 'Tagline' } },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: { ru: 'Описание (Markdown)', en: 'Description (Markdown)' },
    },
    {
      name: 'outcomes',
      type: 'array',
      label: { ru: 'Чему научится слушатель', en: 'Learning outcomes' },
      fields: [{ name: 'text', type: 'text', localized: true }],
    },
    { name: 'cover', type: 'upload', relationTo: 'media', label: { ru: 'Обложка', en: 'Cover' } },
    {
      name: 'coverPrompt',
      type: 'textarea',
      admin: { description: 'Сюжет для генерации обложки' },
      label: { ru: 'Сюжет иллюстрации', en: 'Illustration prompt' },
    },
    {
      name: 'lessons',
      type: 'join',
      collection: 'lessons',
      on: 'course',
      defaultSort: 'order',
      defaultLimit: 200,
      label: { ru: 'Уроки', en: 'Lessons' },
    },
  ],
}
