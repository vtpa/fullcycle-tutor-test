import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import md5 from 'md5'
import { knex } from '../database'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      email: z.string().trim().min(1),
      password: z.string().trim().min(1),
    })

    const parsedBody = createUserBodySchema.safeParse(request.body)

    if (!parsedBody.success) {
      return reply.status(422).send({
        error: {
          fieldErrors: parsedBody.error.flatten().fieldErrors,
        },
      })
    }

    const { email, password } = parsedBody.data

    const newUser = await knex('users')
      .insert({
        id: randomUUID(),
        email,
        password: md5(password),
      })
      .returning(['id', 'email', 'created_at'])

    reply.status(201).send(newUser[0])
  })
}
