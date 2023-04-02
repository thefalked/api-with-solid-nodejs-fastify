import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
})

const envParsed = envSchema.safeParse(process.env)

if (envParsed.success === false) {
  console.error('❌ Invalid environment variables', envParsed.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = envParsed.data
