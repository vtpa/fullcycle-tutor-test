/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkUserToken } from '../middlewares/check-user-token'

export async function inventoryMovementRoutes(app: FastifyInstance) {
  app.post(
    '/:type',
    {
      preHandler: [checkUserToken],
    },
    async (request, reply) => {
      const createInventoryMovementBodySchema = z.object({
        product_id: z.string().uuid(),
        quantity: z.coerce.number().positive().gt(0),
      })

      const createInventoryMovementParamSchema = z.object({
        type: z.union([z.literal('add'), z.literal('sub')]),
      })

      const parsedParams = createInventoryMovementParamSchema.safeParse(
        request.params,
      )

      const parsedBody = createInventoryMovementBodySchema.safeParse(
        request.body,
      )

      if (!parsedBody.success || !parsedParams.success) {
        return reply.status(422).send({
          error: {
            fieldErrors:
              !parsedBody.success && parsedBody.error.flatten().fieldErrors,
            paramErrors:
              !parsedParams.success && parsedParams.error.flatten().fieldErrors,
          },
        })
      }

      const { product_id, quantity } = parsedBody.data
      const { type } = parsedParams.data

      const product = await knex('products').where({ id: product_id }).select()

      if (product.length === 0) {
        return reply.status(422).send({
          error: 'Product not found!',
        })
      }

      const newQuantity =
        type === 'add'
          ? product[0].quantity + quantity
          : product[0].quantity - quantity

      if (newQuantity < 0) {
        return reply.status(422).send({
          error: 'Insufficient stock.',
        })
      }

      const changedProduct = await knex('products')
        .update({
          quantity: newQuantity,
        })
        .where({ id: product_id })
        .returning('*')

      await knex('inventory_movements').insert({
        id: randomUUID(),
        product_id,
        quantity,
        type,
      })

      reply.status(201).send(changedProduct[0])
    },
  )
}
