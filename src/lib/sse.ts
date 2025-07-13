export function createSSEStream(setup: (push: (event: string, data?: Record<string, any>) => void) => (() => void) | void): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  const queue: Uint8Array[] = []
  let resolver: ((chunk: Uint8Array) => void) | null = null

  const push: (event: string, data?: Record<string, any>) => void = (event, data = {}) => {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    const encoded = encoder.encode(payload)

    if (resolver) {
      resolver(encoded)
      resolver = null
    } else {
      queue.push(encoded)
    }
  }

  const cleanup = setup(push) || (() => {})

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (queue.length > 0) {
        controller.enqueue(queue.shift()!)
      } else {
        await new Promise<Uint8Array>((resolve) => (resolver = resolve)).then((chunk) => {
          controller.enqueue(chunk)
        })
      }
    },
    cancel() {
      console.log("SSE stream cancelled")
      cleanup()
    },
  })

  return stream
}


export const SSEHeaders = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};