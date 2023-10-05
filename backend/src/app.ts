import fastify from 'fastify'

import { categoriesRoutes } from './routes/categories'
import { productsRoutes } from './routes/products'
import { inventoryMovementRoutes } from './routes/inventoryMovements'
import { authRoutes } from './routes/auth'
import { usersRoutes } from './routes/users'

export const app = fastify()

app.register(authRoutes, {
  prefix: 'auth',
})
app.register(usersRoutes, {
  prefix: 'users',
})

app.register(categoriesRoutes, {
  prefix: 'categories',
})
app.register(productsRoutes, {
  prefix: 'products',
})
app.register(inventoryMovementRoutes, {
  prefix: 'inventory',
})
