import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
  TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
