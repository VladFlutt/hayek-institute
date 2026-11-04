import type { CollectionConfig } from 'payload'
import { anyone, editors } from '../access/roles'

/** PDFs of books and course materials moved over from Google Drive. */
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: { ru: 'Документ (PDF)', en: 'Document (PDF)' }, plural: { ru: 'Документы (PDF)', en: 'Documents (PDF)' } },
  admin: { group: { ru: 'Файлы', en: 'Files' } },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  fields: [{ name: 'title', type: 'text', label: { ru: 'Название', en: 'Title' } }],
  upload: { mimeTypes: ['application/pdf', 'application/epub+zip', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] },
}
