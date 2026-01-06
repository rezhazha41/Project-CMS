import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'menus'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('parent_id').unsigned().nullable().references('id').inTable('menus').onDelete('CASCADE')
      table.string('label').notNullable()
      table.string('url').notNullable()
      table.integer('order').defaultTo(0)
      table.string('target').defaultTo('_self') // _self, _blank
      table.boolean('is_active').defaultTo(true)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}