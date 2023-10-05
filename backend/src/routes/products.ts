/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkUserToken } from '../middlewares/check-user-token'

export async function productsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkUserToken],
    },
    async (request, reply) => {
      const getProductQuerySchema = z.object({
        page: z.coerce.number().positive().gt(0).default(1),
      })

      const parsedQueries = getProductQuerySchema.safeParse(request.query)

      if (!parsedQueries.success) {
        return reply.status(422).send({
          error: {
            fieldErrors: parsedQueries.error.flatten().fieldErrors,
          },
        })
      }

      const MAX_REGISTERS_BY_PAGE = 15
      const { page } = parsedQueries.data

      const products = await knex('products')
        .offset(page * MAX_REGISTERS_BY_PAGE - MAX_REGISTERS_BY_PAGE)
        .limit(MAX_REGISTERS_BY_PAGE)
        .select()
      return {
        data: products,
        meta: {
          page,
        },
      }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkUserToken],
    },
    async (request, reply) => {
      const getProductParamSchema = z.object({
        id: z.string().uuid(),
      })

      const parsedParams = getProductParamSchema.safeParse(request.params)

      if (!parsedParams.success) {
        return reply.status(422).send({
          error: {
            fieldErrors: parsedParams.error.flatten().fieldErrors,
          },
        })
      }

      const product = await knex('products as p')
        .join('categories as c', 'c.id', 'p.category_id')
        .select(
          'p.id',
          'p.name',
          'p.quantity',
          'c.id as category_id',
          'c.name as category_name',
          'p.created_at',
        )
        .where({ 'p.id': parsedParams.data.id })

      if (product.length === 0) {
        return reply.status(422).send({
          error: 'Product not found!',
        })
      }

      return product[0]
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkUserToken],
    },
    async (request, reply) => {
      const createProductBodySchema = z.object({
        name: z.string().trim().min(1),
        category_id: z.string().uuid(),
      })

      const parsedBody = createProductBodySchema.safeParse(request.body)

      if (!parsedBody.success) {
        return reply.status(422).send({
          error: {
            fieldErrors: parsedBody.error.flatten().fieldErrors,
          },
        })
      }

      const { category_id, name } = parsedBody.data

      const category = await knex('categories')
        .where({ id: category_id })
        .select()

      if (category.length === 0) {
        return reply.status(422).send({
          error: 'Category not found!',
        })
      }

      const newProduct = await knex('products')
        .insert({
          id: randomUUID(),
          name,
          category_id,
          quantity: 0,
        })
        .returning('*')

      reply.status(201).send(newProduct[0])
    },
  )
}
