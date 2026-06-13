import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { serve } from '@hono/node-server'
import notifyRouter from './routes/notify.js'

const app = new Hono()

// Global Middlewares
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))
app.use('*', logger())
app.use('*', prettyJSON())

// Base health check & status endpoint (Industry Standard API Root)
app.get('/', (c) => {
  return c.json({
    name: 'fidel-tools-api',
    description: 'Production-ready Hono API for Amharic NLP pre-processing',
    version: '0.1.0',
    status: 'operational',
    documentation: 'https://github.com/Yehonatal/fidel-tools',
    endpoints: {
      health: { path: '/', method: 'GET', status: 'active' },
      notify: { path: '/notify', method: 'POST', status: 'active' },
      nlp: { path: '/api/v1/nlp/*', method: 'POST', status: 'coming_soon' }
    }
  })
})

// Coming soon placeholder handler for NLP routes
app.all('/api/v1/nlp/*', (c) => {
  return c.json({
    status: 501,
    message: 'NLP pre-processing endpoints are coming soon. Stay tuned!',
    endpoints: [
      '/api/v1/nlp/pipeline',
      '/api/v1/nlp/normalize',
      '/api/v1/nlp/tokenize',
      '/api/v1/nlp/remove-stopwords',
      '/api/v1/nlp/stem',
      '/api/v1/nlp/transliterate'
    ]
  }, 501)
})

// Mount active sub-routers
app.route('/api/v1/notify', notifyRouter)
app.route('/notify', notifyRouter) // Direct mount fallback for frontend subscriber form

// Unhandled error recovery handler
app.onError((err, c) => {
  console.error('Unhandled API Exception:', err)
  return c.json({ error: 'Internal Server Error', message: err.message }, 500)
})

// Start serve instance
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
console.log(`Server listening on port ${port}`)
serve({
  fetch: app.fetch,
  port
})

export default app
