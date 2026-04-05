import Anthropic from '@anthropic-ai/sdk'
import {
  SYSTEM_PROMPT,
  UNKNOWN_TIME_ADDENDUM,
} from './prompt-templates/system'
import { buildUserMessage } from './prompt-builder'
import type { FortuneData } from '../orrery/types'

const anthropic = new Anthropic()

export async function streamFortuneReading(
  data: FortuneData,
  signal?: AbortSignal
) {
  const systemPrompt = data.timeUnknown
    ? SYSTEM_PROMPT + UNKNOWN_TIME_ADDENDUM
    : SYSTEM_PROMPT

  const userMessage = buildUserMessage(data)

  const stream = anthropic.messages.stream(
    {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    },
    { signal }
  )

  return stream
}
