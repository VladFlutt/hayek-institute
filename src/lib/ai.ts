/**
 * Provider-agnostic chat client for any OpenAI-compatible API.
 * Default: Groq free tier. Switch with env vars (AI_PROVIDER, AI_API_KEY, optional AI_MODEL), no code changes.
 */
export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

const PRESETS: Record<string, { baseUrl: string; model: string }> = {
  groq: { baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1', model: 'deepseek/deepseek-chat-v3-0324:free' },
  mistral: { baseUrl: 'https://api.mistral.ai/v1', model: 'mistral-small-latest' },
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-flash-latest' },
}

/** AI_PROVIDER picks a preset (groq | openrouter | mistral | gemini); AI_BASE_URL / AI_MODEL override it. */
export const aiConfig = () => {
  const preset = PRESETS[(process.env.AI_PROVIDER || 'groq').toLowerCase()] ?? PRESETS.groq
  return {
    baseUrl: (process.env.AI_BASE_URL || preset.baseUrl).replace(/\/$/, ''),
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || preset.model,
  }
}

// Providers retire models. When the configured one is gone, pick a current one from the provider's /models list.
const PREFERRED = ['gpt-oss-120b', 'kimi-k2', 'llama-4-maverick', 'qwen3-32b', 'llama-3.3-70b', 'deepseek', 'mistral-medium', 'mistral-small', 'gemini', 'llama-4-scout', 'gpt-oss-20b']
const NOT_CHAT = /whisper|tts|guard|embed|vision-only|orpheus|playai|distil|compound|safeguard/i
let fallbackModel: string | null = null

export async function listModels(): Promise<string[]> {
  const { baseUrl, apiKey } = aiConfig()
  const res = await fetch(`${baseUrl}/models`, { headers: { authorization: `Bearer ${apiKey}` } })
  if (!res.ok) return []
  const d = (await res.json().catch(() => ({}))) as { data?: { id: string; active?: boolean }[] }
  return (d.data ?? []).filter((m) => m.active !== false).map((m) => m.id)
}

async function pickFallbackModel(): Promise<string | null> {
  const ids = (await listModels()).filter((id) => !NOT_CHAT.test(id))
  for (const p of PREFERRED) {
    const hit = ids.find((id) => id.toLowerCase().includes(p))
    if (hit) return hit
  }
  return ids[0] ?? null
}

/** The model actually used (after an automatic fallback, if one happened). */
export const currentModel = () => fallbackModel || aiConfig().model

/** Streams assistant text deltas from an OpenAI-compatible /chat/completions endpoint. */
export async function streamChat(messages: ChatMessage[], signal?: AbortSignal): Promise<ReadableStream<Uint8Array>> {
  const { baseUrl, apiKey } = aiConfig()
  if (!apiKey) throw new Error('AI_API_KEY is not set')
  const call = (model: string) =>
    fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages, stream: true, temperature: 0.3 }),
      signal,
    })
  let res = await call(currentModel())
  if ((res.status === 404 || res.status === 400) && !process.env.AI_MODEL) {
    const text = await res.clone().text().catch(() => '')
    if (/model_not_found|model_decommissioned|does not exist|decommissioned/i.test(text)) {
      const next = await pickFallbackModel()
      if (next && next !== currentModel()) {
        console.warn(`AI model ${currentModel()} is unavailable, switching to ${next}`)
        fallbackModel = next
        res = await call(next)
      }
    }
  }
  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => '')
    throw new Error(`AI provider error ${res.status}: ${text.slice(0, 300)}`)
  }
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buf = ''
  return res.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buf += decoder.decode(chunk, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''
        for (const line of lines) {
          const t = line.trim()
          if (!t.startsWith('data:')) continue
          const data = t.slice(5).trim()
          if (data === '[DONE]') continue
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content
            if (delta) controller.enqueue(encoder.encode(delta))
          } catch {
            /* ignore keep-alives */
          }
        }
      },
    }),
  )
}
