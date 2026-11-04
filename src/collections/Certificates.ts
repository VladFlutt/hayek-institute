import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access/roles'

export const Certificates: CollectionConfig = {
  slug: 'certificates',
  labels: { singular: { ru: 'Сертификат', en: 'Certificate' }, plural: { ru: 'Сертификаты', en: 'Certificates' } },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'name', 'course', 'issuedAt'],
    group: { ru: 'Слушатели и доступ', en: 'Students & access' },
    description: 'Выдаётся автоматически, когда слушатель отметил пройденными все занятия курса. Удалите запись, чтобы отозвать сертификат.',
  },
  // Issued only by the server; anyone can check a code on the /verify page
  access: { read: adminOnly, create: () => false, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'code', type: 'text', unique: true, index: true, required: true, label: { ru: 'Номер', en: 'Number' } },
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, index: true, label: { ru: 'Слушатель', en: 'Student' } },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true, label: { ru: 'Курс', en: 'Course' } },
    { name: 'name', type: 'text', required: true, label: { ru: 'Имя в сертификате', en: 'Name on certificate' } },
    { name: 'issuedAt', type: 'date', required: true, label: { ru: 'Дата выдачи', en: 'Issued on' } },
  ],
}
