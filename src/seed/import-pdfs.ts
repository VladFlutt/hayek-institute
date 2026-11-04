/**
 * Moves library files from Google Drive into the site's own storage (Vercel Blob in production).
 * For every resource that links to a Drive file and has no uploaded file yet, the file is downloaded
 * and attached as a Document. The Drive link stays on the resource as a fallback.
 * Idempotent and safe to re-run; files that cannot be downloaded (private on Drive) are skipped and listed.
 *   pnpm import:pdfs
 */
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

const DRIVE_ID = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([\w-]{20,})/

const EXT: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/epub+zip': 'epub',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

function fileName(title: string, ext: string) {
  const base = title
    .replace(/[\\/:*?"<>|«»]+/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 90)
  return `${base || 'document'}.${ext}`
}

let lastReason = ''

async function download(id: string): Promise<{ data: Buffer; mimetype: string } | null> {
  // PDF_DIR=<folder with <driveId>.pdf files> imports files fetched beforehand instead of downloading
  const local = process.env.PDF_DIR && path.join(process.env.PDF_DIR, `${id}.pdf`)
  if (local && existsSync(local)) return { data: readFileSync(local), mimetype: 'application/pdf' }
  const url = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`
  const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (HayekInstitute import)' } })
  const type = (res.headers.get('content-type') || '').split(';')[0].trim()
  if (!res.ok) {
    lastReason = `HTTP ${res.status} ${type}`
    return null
  }
  const data = Buffer.from(await res.arrayBuffer())
  // Drive often answers application/octet-stream, so trust the file signature, not the header
  const head = data.subarray(0, 4).toString('latin1')
  const mimetype = head === '%PDF' ? 'application/pdf' : head.startsWith('PK') && EXT[type] ? type : EXT[type] && type !== 'text/html' ? type : ''
  if (!mimetype) {
    lastReason = `not a document (${type}, ${data.length} bytes)`
    return null
  }
  return { data, mimetype }
}

const payload = await getPayload({ config })
const { docs } = await payload.find({
  collection: 'resources',
  where: { and: [{ url: { contains: 'drive.google.com' } }, { file: { exists: false } }] },
  limit: 500,
  depth: 0,
  overrideAccess: true,
})

let moved = 0
const skipped: string[] = []
for (const r of docs) {
  const id = r.url?.match(DRIVE_ID)?.[1]
  if (!id) continue
  try {
    const got = await download(id)
    if (!got) {
      skipped.push(`${r.title}: ${lastReason} (${r.url})`)
      continue
    }
    const doc = await payload.create({
      collection: 'documents',
      data: { title: r.title },
      file: { data: got.data, mimetype: got.mimetype, name: fileName(r.title, EXT[got.mimetype]), size: got.data.length },
      overrideAccess: true,
    })
    await payload.update({ collection: 'resources', id: r.id, data: { file: doc.id }, overrideAccess: true, depth: 0 })
    moved++
    payload.logger.info(`PDF moved: ${r.title} (${Math.round(got.data.length / 1024)} KB)`)
  } catch (e) {
    skipped.push(`${r.title}: ${(e as Error).message}`)
  }
}
payload.logger.info(`PDF import: ${moved} moved, ${skipped.length} skipped, ${docs.length - moved - skipped.length} without a Drive id`)
for (const s of skipped) payload.logger.warn(`PDF skipped: ${s}`)
process.exit(0)
