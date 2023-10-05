import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkUserToken } from '../middlewares/check-user-token'

export async function categoriesRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkUserToken],
    },
    async (request) => {
      const categories = await knex('categories').select()
      return categories
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkUserToken],
    },
    async (request, reply) => {
      const createCategoryBodySchema = z.object({
        name: z.string().trim().min(1),
      })

      const parsedBody = createCategoryBodySchema.safeParse(request.body)

      if (!parsedBody.success) {
        return reply.status(422).send({
          error: {
            fieldErrors: parsedBody.error.flatten().fieldErrors,
          },
        })
      }

      const { name } = parsedBody.data

      const newCategory = await knex('categories')
        .insert({
          id: randomUUID(),
          name,
        })
        .returning('*')

      reply.status(201).send(newCategory[0])
    },
  )
}
