import type { CollectionConfig } from 'payload'
import { editors, isStaff, publishedOrStaff } from '../access/roles'
import { lessonContentAccess } from '../access/lessonAccess'

export const LESSON_KINDS = [
  { label: { ru: 'Лекция', en: 'Lecture' }, value: 'lecture' },
  { label: { ru: 'Семинар', en: 'Seminar' }, value: 'seminar' },
  { label: { ru: 'Гость', en: 'Guest talk' }, value: 'guest' },
  { label: { ru: 'Текстовый урок', en: 'Reading lesson' }, value: 'text' },
] as const

const guarded = { read: lessonContentAccess }

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  labels: { singular: { ru: 'Урок', en: 'Lesson' }, plural: { ru: 'Уроки', en: 'Lessons' } },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'course', 'kind', 'number', 'free', '_status'],
    group: { ru: 'Учебная программа', en: 'Curriculum' },
    listSearchableFields: ['title', 'slug'],
  },
  defaultSort: 'order',
  versions: { drafts: true, maxPerDoc: 30 },
  access: { read: publishedOrStaff, create: editors, update: ({ req }) => isStaff(req), delete: editors },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          // First lecture of every course is open for free by default
          if (data.free === undefined || data.free === null) {
            data.free = data.kind === 'lecture' && Number(data.number) === 1
          }
          if (!data.slug && data.kind && data.number) data.slug = `${data.kind}-${data.number}`
          if (data.order === undefined || data.order === null) {
            const base = { lecture: 0, seminar: 0, guest: 1000, text: 0 }[data.kind as string] ?? 0
            data.order = base + Number(data.number || 0) * 2 + (data.kind === 'seminar' ? 1 : 0)
          }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { ru: 'Название', en: 'Title' } },
    {
      type: 'row',
      fields: [
        { name: 'course', type: 'relationship', relationTo: 'courses', required: true, index: true, label: { ru: 'Курс', en: 'Course' } },
        { name: 'kind', type: 'select', required: true, defaultValue: 'lecture', options: [...LESSON_KINDS], label: { ru: 'Тип', en: 'Type' } },
        { name: 'number', type: 'number', label: { ru: 'Номер', en: 'Number' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'slug', type: 'text', index: true, admin: { description: 'например lecture-3' } },
        { name: 'order', type: 'number', label: { ru: 'Порядок', en: 'Order' } },
        { name: 'date', type: 'text', label: { ru: 'Дата занятия', en: 'Date' } },
      ],
    },
    {
      name: 'free',
      type: 'checkbox',
      label: { ru: 'Бесплатный (открыт без кода)', en: 'Free (no code needed)' },
      admin: { position: 'sidebar' },
    },
    { name: 'guestName', type: 'text', localized: true, label: { ru: 'Гость', en: 'Guest' }, admin: { condition: (_, s) => s?.kind === 'guest' } },
    { name: 'youtubeUrl', type: 'text', label: { ru: 'Ссылка на видео (YouTube)', en: 'Video URL (YouTube)' }, access: guarded },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      access: guarded,
      label: { ru: 'Конспект (Markdown)', en: 'Summary (Markdown)' },
    },
    {
      name: 'body',
      type: 'textarea',
      localized: true,
      access: guarded,
      admin: { rows: 20 },
      label: { ru: 'Текст урока (Markdown)', en: 'Lesson text (Markdown)' },
    },
    {
      name: 'timecodes',
      type: 'array',
      access: guarded,
      label: { ru: 'Тайм-коды', en: 'Timecodes' },
      fields: [
        { type: 'row', fields: [
          { name: 'at', type: 'text', required: true, admin: { width: '20%' }, label: { ru: 'Время (мм:сс)', en: 'Time (mm:ss)' } },
          { name: 'label', type: 'text', localized: true, label: { ru: 'Что обсуждается', en: 'Topic' } },
        ] },
      ],
    },
    {
      name: 'questions',
      type: 'array',
      access: guarded,
      label: { ru: 'Вопросы для самопроверки', en: 'Self-check questions' },
      fields: [
        { name: 'question', type: 'text', localized: true },
        { name: 'answer', type: 'textarea', localized: true, label: { ru: 'Ответ / пояснение', en: 'Answer' } },
      ],
    },
    {
      name: 'links',
      type: 'array',
      access: guarded,
      label: { ru: 'Доп. материалы и ссылки', en: 'Extra links' },
      fields: [
        { type: 'row', fields: [
          { name: 'label', type: 'text', localized: true },
          { name: 'url', type: 'text', required: true },
        ] },
      ],
    },
    { name: 'cover', type: 'upload', relationTo: 'media', label: { ru: 'Иллюстрация', en: 'Illustration' } },
    {
      name: 'transcript',
      type: 'textarea',
      access: { read: ({ req }) => isStaff(req) },
      admin: { rows: 10, description: 'Расшифровка видео. Не показывается на сайте, используется ИИ-наставником.' },
      label: { ru: 'Расшифровка', en: 'Transcript' },
    },
  ],
}
