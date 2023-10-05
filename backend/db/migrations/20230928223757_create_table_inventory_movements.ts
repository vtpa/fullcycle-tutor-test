import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('inventory_movements', (table) => {
    table.uuid('id').notNullable()
    table
      .uuid('product_id')
      .references('id')
      .inTable('products')
      .onDelete('SET NULL')
    table.decimal('quantity', 10, 2).notNullable()
    table.text('type')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('inventory_movements')
}
