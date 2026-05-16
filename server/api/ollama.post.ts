import type { IncomingMessage, ServerResponse } from 'http'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { message, model = 'llama3' } = body || {}

  if (!message) {
    return { error: 'No message provided' }
  }

  // Forward the message to local Ollama server
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'user', content: message }
      ]
    })
  })

  if (!response.ok) {
    return { error: 'Failed to connect to Ollama' }
  }

  const data = await response.json()
  // Ollama returns { message: { content: ... } }
  return { reply: data.message?.content || '' }
})
