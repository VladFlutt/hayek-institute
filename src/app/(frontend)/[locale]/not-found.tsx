import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="wrap narrow" style={{ padding: '60px 20px' }}>
      <h1>404</h1>
      <p className="muted">Страница не найдена · Page not found</p>
      <Link className="btn" href="/">← Институт Хайека</Link>
    </div>
  )
}
