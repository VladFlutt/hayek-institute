/** Parses the course-links markdown compiled from Pavel Usanov's emails. */
export type ParsedLink = { label: string; url: string }
export type ParsedLesson = {
  kind: 'lecture' | 'seminar' | 'guest'
  number: number | null
  label: string
  url: string
  links: ParsedLink[]
}
export type ParsedResource = {
  label: string
  author: string
  title: string
  url: string | null
  links: ParsedLink[]
  crossRef: string | null
}
export type ParsedSection = {
  number: number
  title: string
  lessons: ParsedLesson[]
  resources: ParsedResource[]
}

const ORD: Record<string, number> = {}
;[
  ['перв', 1], ['втор', 2], ['трет', 3], ['четверт', 4], ['пят', 5], ['шест', 6],
  ['седьм', 7], ['восьм', 8], ['девят', 9], ['десят', 10],
].forEach(([k, v]) => (ORD[k as string] = v as number))

export const ordinalOf = (label: string): number | null => {
  const w = label.trim().toLowerCase().split(/[\s,(]/)[0]
  for (const [k, v] of Object.entries(ORD)) if (w.startsWith(k)) return v
  return null
}

const URL_RE = /(https?:\/\/\S+)/

const splitItem = (text: string): { label: string; url: string | null } => {
  const m = text.match(URL_RE)
  if (!m) return { label: text.trim(), url: null }
  const label = text.slice(0, m.index).replace(/[:\s]+$/, '').trim()
  return { label, url: m[1] }
}

const splitAuthorTitle = (label: string) => {
  const m = label.match(/^(.*?)\s*«(.+)»\s*(.*)$/)
  if (m) {
    const author = m[1].trim()
    return { author, title: `«${m[2]}»${m[3] ? ' ' + m[3] : ''}`.trim() }
  }
  return { author: label, title: label }
}

export function parseCourseLinks(md: string): ParsedSection[] {
  const sections: ParsedSection[] = []
  let sec: ParsedSection | null = null
  let sub: 'lectures' | 'seminars' | 'guests' | 'literature' | null = null
  let lastLesson: ParsedLesson | null = null
  let lastRes: ParsedResource | null = null

  for (const raw of md.split('\n')) {
    const line = raw.replace(/\s+$/, '')
    const h = line.match(/^## (\d+)\. (.+?)(?: \(.+\))?$/)
    if (h) {
      sec = { number: Number(h[1]), title: h[2], lessons: [], resources: [] }
      sections.push(sec)
      sub = null
      continue
    }
    if (!sec) continue
    const b = line.match(/^\*\*(.+)\*\*$/)
    if (b) {
      const t = b[1].toLowerCase()
      sub = t.startsWith('лекц') ? 'lectures' : t.startsWith('семин') ? 'seminars' : t.startsWith('пригл') ? 'guests' : t.startsWith('литер') ? 'literature' : null
      lastLesson = null
      lastRes = null
      continue
    }
    if (!sub) continue

    const subItem = line.match(/^\s{2,}- (.+)$/)
    if (subItem) {
      const { label, url } = splitItem(subItem[1])
      if (!url) continue
      if (sub === 'literature' && lastRes) {
        if (!lastRes.url) lastRes.url = url
        lastRes.links.push({ label: label || 'ссылка', url })
      } else if (lastLesson) {
        lastLesson.links.push({ label: label || 'ссылка', url })
      }
      continue
    }
    const item = line.match(/^(?:(\d+)\.|-) (.+)$/)
    if (!item) continue
    const listNo = item[1] ? Number(item[1]) : null
    const { label, url } = splitItem(item[2])

    if (sub === 'literature') {
      const cross = label.match(/ссылка в курсе «(.+?)»/) || item[2].match(/ссылка в курсе «(.+?)»/)
      const cleanLabel = label.replace(/:\s*ссылка в курсе.*$/, '').trim()
      const { author, title } = splitAuthorTitle(cleanLabel)
      lastRes = { label: cleanLabel, author, title, url, links: [], crossRef: cross ? cross[1] : null }
      sec.resources.push(lastRes)
      continue
    }
    if (!url) continue
    const kind = sub === 'lectures' ? 'lecture' : sub === 'seminars' ? 'seminar' : 'guest'
    let number: number | null = null
    if (kind !== 'guest') number = ordinalOf(label) ?? (/^\d/.test(label) ? listNo : listNo)
    if (kind === 'lecture' && !item[1]) number = null // bonus lectures listed with "-"
    lastLesson = { kind, number, label, url, links: [] }
    sec.lessons.push(lastLesson)
  }
  return sections
}
