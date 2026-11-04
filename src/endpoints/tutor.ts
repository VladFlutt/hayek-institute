import type { Endpoint } from 'payload'
import { streamChat, type ChatMessage } from '../lib/ai'
import { searchGlossary, searchLessons } from '../lib/retrieval'
import { canOpenLesson } from '../access/lessonAccess'

const MODES: Record<string, { ru: string; en: string }> = {
  explain: {
    ru: 'Режим «Объясни»: дай ясное объяснение со ссылками на занятия школы.',
    en: 'Mode "Explain": give a clear explanation with references to school lessons.',
  },
  check: {
    ru: 'Режим «Проверь мой аргумент»: приведи аргумент слушателя к форме силлогизма, проверь форму и истинность каждой посылки, назови ошибки, предложи исправленную версию.',
    en: 'Mode "Check my argument": restate the argument as a syllogism, test validity and each premise, name fallacies, propose a corrected version.',
  },
  socratic: {
    ru: 'Режим «Сократический диалог»: не давай готового ответа; задавай по одному наводящему вопросу, чтобы слушатель сам пришёл к выводу.',
    en: 'Mode "Socratic dialogue": do not give the answer; ask one guiding question at a time so the student reaches the conclusion.',
  },
  exam: {
    ru: 'Режим «Экзаменатор»: задай один вопрос по теме занятия, дождись ответа, оцени его по шкале «верно / частично / неверно» с пояснением и задай следующий.',
    en: 'Mode "Examiner": ask one question on the lesson topic, wait for the answer, grade it (correct / partial / wrong) with explanation, then ask the next.',
  },
}

/** POST /api/tutor { messages, mode, lessonId?, locale } → text/plain stream */
export const tutorEndpoint: Endpoint = {
  path: '/tutor',
  method: 'post',
  handler: async (req) => {
    const { payload } = req
    const user = req.user as any
    if (!user || user.collection !== 'users') return Response.json({ error: 'login' }, { status: 401 })

    const body = ((await req.json?.()) ?? {}) as {
      messages?: { role: string; content: string }[]
      mode?: string
      lessonId?: number | string
      locale?: string
    }
    const locale = body.locale === 'en' ? 'en' : 'ru'
    const history = (body.messages ?? [])
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-12)
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content.slice(0, 4000) }))
    const last = [...history].reverse().find((m) => m.role === 'user')
    if (!last) return Response.json({ error: 'empty' }, { status: 400 })

    const charter = await payload.findGlobal({ slug: 'assistant-charter', locale, overrideAccess: true })
    if (charter.enabled === false) return Response.json({ error: 'disabled' }, { status: 503 })

    // Daily limit per student
    const today = new Date().toISOString().slice(0, 10)
    const fresh = await payload.findByID({ collection: 'users', id: user.id, depth: 0, overrideAccess: true })
    const used = fresh.tutorUsage?.day === today ? fresh.tutorUsage?.count ?? 0 : 0
    const limit = charter.dailyLimit ?? 30
    if (fresh.role === 'student' && used >= limit) return Response.json({ error: 'limit', limit }, { status: 429 })
    await payload.update({
      collection: 'users',
      id: user.id,
      overrideAccess: true,
      data: { tutorUsage: { day: today, count: used + 1 } },
    })

    // Context: current lesson (only if the student may open it) + search over all lessons + glossary
    let lessonCtx = ''
    if (body.lessonId) {
      try {
        const lesson = await payload.findByID({ collection: 'lessons', id: body.lessonId, locale, depth: 1, overrideAccess: true })
        if (canOpenLesson(fresh as any, lesson as any)) {
          const course = typeof lesson.course === 'object' ? lesson.course : null
          lessonCtx = [
            `Курс: ${course?.title ?? ''}`,
            `Занятие: ${lesson.title}`,
            lesson.summary ? `Конспект:\n${lesson.summary}` : '',
            lesson.body ? `Текст урока:\n${lesson.body.slice(0, 6000)}` : '',
            lesson.timecodes?.length ? `Тайм-коды:\n${lesson.timecodes.map((t) => `${t.at} ${t.label}`).join('\n')}` : '',
            lesson.transcript ? `Фрагмент расшифровки:\n${lesson.transcript.slice(0, 6000)}` : '',
          ].filter(Boolean).join('\n\n')
        }
      } catch {
        /* lesson not found */
      }
    }
    const [excerpts, terms, courses] = await Promise.all([
      searchLessons(payload, last.content, locale).catch(() => []),
      searchGlossary(payload, last.content, locale).catch(() => []),
      payload.find({ collection: 'courses', locale, limit: 50, depth: 0, select: { title: true, slug: true, tagline: true } }),
    ])

    const system = [
      charter.charter,
      MODES[body.mode ?? 'explain']?.[locale] ?? MODES.explain[locale],
      `Курсы школы:\n${courses.docs.map((c) => `- ${c.title} (/${locale}/courses/${c.slug}): ${c.tagline ?? ''}`).join('\n')}`,
      lessonCtx ? `## Текущее занятие слушателя\n${lessonCtx}` : '',
      excerpts.length
        ? `## Найденные фрагменты материалов школы\n${excerpts.map((e, i) => `[${i + 1}] ${e.course} — ${e.lesson} (${e.url})\n${e.text}`).join('\n\n')}`
        : '## Найденные фрагменты материалов школы\n(ничего не найдено — отвечай из принципов Хартии и честно скажи, что в материалах школы прямого ответа нет)',
      terms.length ? `## Глоссарий школы\n${terms.map((t) => `- ${t.term}: ${t.definition}${t.source ? ` (${t.source})` : ''}`).join('\n')}` : '',
      'Ссылаясь на занятие, давай markdown-ссылку на его адрес из списка выше.',
    ].filter(Boolean).join('\n\n')

    const messages: ChatMessage[] = [{ role: 'system', content: system }, ...history]
    try {
      const stream = await streamChat(messages)
      return new Response(stream, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } })
    } catch (e) {
      payload.logger.error(e)
      return Response.json({ error: 'provider' }, { status: 502 })
    }
  },
}
