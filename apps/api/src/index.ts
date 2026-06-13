import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { promises as fs } from 'fs'
import { join } from 'path'

const app = new Hono()

// Enable CORS for frontend requests
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))

app.get('/', (c) => c.text('Fidel Tools API is running!'))

app.post('/notify', async (c) => {
  try {
    const { email } = await c.req.json()
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return c.json({ error: 'Invalid email address' }, 400)
    }

    const filePath = join(process.cwd(), 'subscribers.json')
    let subscribers: string[] = []

    try {
      const data = await fs.readFile(filePath, 'utf8')
      subscribers = JSON.parse(data)
    } catch (err: any) {
      // File doesn't exist or is empty, start with an empty array
    }

    if (!subscribers.includes(email)) {
      subscribers.push(email)
      await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2), 'utf8')
    }

    return c.json({ success: true, message: 'Subscribed successfully' })
  } catch (error: any) {
    return c.json({ error: 'Internal server error', details: error.message }, 500)
  }
})

// Start server on port 3000 (standard Docker EXPOSE port) or from env
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
console.log(`Server starting on port ${port}`)
serve({
  fetch: app.fetch,
  port
})

export default app
