import type { Payload } from 'payload'
import { searchGlossary, searchLessons } from './retrieval'
import { canOpenLesson } from '../access/lessonAccess'

export const MODES: Record<string, { ru: string; en: string }> = {
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

/** Builds the tutor's system prompt: charter + mode + course list + current lesson + retrieved excerpts + glossary. */
export async function buildTutorSystem(
  payload: Payload,
  opts: { locale: 'ru' | 'en'; mode?: string; question: string; lessonId?: number | string; user?: unknown; charter: string },
): Promise<string> {
  const { locale, question } = opts
  let lessonCtx = ''
  if (opts.lessonId) {
    try {
      const lesson = await payload.findByID({ collection: 'lessons', id: opts.lessonId, locale, depth: 1, overrideAccess: true })
      if (canOpenLesson(opts.user as any, lesson as any)) {
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
    searchLessons(payload, question, locale).catch(() => []),
    searchGlossary(payload, question, locale).catch(() => []),
    payload.find({ collection: 'courses', locale, limit: 50, depth: 0, select: { title: true, slug: true, tagline: true } }),
  ])
  return [
    opts.charter,
    MODES[opts.mode ?? 'explain']?.[locale] ?? MODES.explain[locale],
    `Курсы школы:\n${courses.docs.map((c) => `- ${c.title} (/${locale}/courses/${c.slug}): ${c.tagline ?? ''}`).join('\n')}`,
    lessonCtx ? `## Текущее занятие слушателя\n${lessonCtx}` : '',
    excerpts.length
      ? `## Найденные фрагменты материалов школы\n${excerpts.map((e, i) => `[${i + 1}] ${e.course} — ${e.lesson} (${e.url})\n${e.text}`).join('\n\n')}`
      : '## Найденные фрагменты материалов школы\n(ничего не найдено — отвечай из принципов Хартии и честно скажи, что в материалах школы прямого ответа нет)',
    terms.length ? `## Глоссарий школы\n${terms.map((t) => `- ${t.term}: ${t.definition}${t.source ? ` (${t.source})` : ''}`).join('\n')}` : '',
    locale === 'en'
      ? 'Format: be concise (usually 150–300 words); use a table only when it truly helps. When you cite a lesson, give a markdown link with its relative address exactly as listed above (it starts with /en/courses/). Never invent addresses, lesson numbers, sections or quotes.'
      : 'Формат: отвечай сжато (обычно 150–300 слов), таблицу давай только когда без неё никак. Ссылаясь на занятие, давай markdown-ссылку с его относительным адресом ровно в том виде, как он указан выше (начинается с /ru/courses/). Не выдумывай адресов, номеров занятий, параграфов и цитат.',
  ].filter(Boolean).join('\n\n')
}
