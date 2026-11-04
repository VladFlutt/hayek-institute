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

/** Streams assistant text deltas from an OpenAI-compatible /chat/completions endpoint. */
export async function streamChat(messages: ChatMessage[], signal?: AbortSignal): Promise<ReadableStream<Uint8Array>> {
  const { baseUrl, apiKey, model } = aiConfig()
  if (!apiKey) throw new Error('AI_API_KEY is not set')
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, stream: true, temperature: 0.3 }),
    signal,
  })
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
