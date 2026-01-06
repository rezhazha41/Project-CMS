import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('post_id').unsigned().notNullable()
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.text('content').notNullable()
      table.boolean('is_approved').defaultTo(true) // Auto-approve for now

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Foreign key removed temporarily to fix migration issue
      // Will add via separate migration if needed
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}