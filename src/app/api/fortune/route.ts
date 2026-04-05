import { NextRequest, NextResponse } from 'next/server'
import { FortuneInputSchema } from '@/lib/claude/input-schema'
import { calculateAllSystems } from '@/lib/orrery/calculate'
import { streamFortuneReading } from '@/lib/claude/client'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const parseResult = FortuneInputSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다.', details: parseResult.error.flatten() },
        { status: 400 }
      )
    }

    const input = parseResult.data

    // Calculate all 3 systems
    const fortuneData = await calculateAllSystems(input)

    // Stream Claude response
    const abortController = new AbortController()

    // Abort if client disconnects
    req.signal.addEventListener('abort', () => {
      abortController.abort()
    })

    const stream = await streamFortuneReading(fortuneData, abortController.signal)

    // Create a ReadableStream that forwards Claude's text chunks
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta as any
              if (delta.type === 'text_delta' && delta.text) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: delta.text })}\n\n`)
                )
              }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          if ((error as Error).name === 'AbortError') {
            controller.close()
            return
          }
          const errMsg = error instanceof Error ? error.message : String(error)
          console.error('[fortune stream error]', errMsg)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: `운세 생성 중 오류: ${errMsg}` })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    console.error('[fortune route error]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
