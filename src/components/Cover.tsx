import { mediaUrl } from '@/lib/server'

const LOCAL_COVERS = new Set([
  'aristotle-logic', 'twelve-rules', 'economic-common-sense', 'laws-of-the-market', 'human-action', 'money-flow',
  'economics-and-law', 'myths-about-the-state', 'intellectual-history', 'western-civilization', 'history-of-philosophy',
])

export function Cover({ media, title, slug, size = 'card' }: { media: unknown; title: string; slug?: string; size?: 'card' | 'hero' }) {
  const url = mediaUrl(media, size) || (slug && LOCAL_COVERS.has(slug) ? `/covers/${slug}.jpg` : null)
  if (url) {
    const alt = (media as { alt?: string } | null)?.alt || title
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={alt} loading="lazy" />
  }
  return (
    <div className="emblem" aria-hidden="true">
      <span>{title.replace(/[«»"]/g, '').trim().charAt(0)}</span>
    </div>
  )
}
