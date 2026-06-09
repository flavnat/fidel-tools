import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Fidel Tools API is running!'))

export default app
