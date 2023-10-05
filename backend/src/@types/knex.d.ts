// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      email: string
      password: string
      created_at: string
    }
    categories: {
      id: string
      name: string
      created_at: string
    }
    products: {
      id: string
      name: string
      category_id: string
      quantity: number
      created_at: string
    }
    inventory_movements: {
      id: string
      product_id: string
      quantity: number
      type: 'add' | 'sub'
      created_at: string
    }
  }
}
