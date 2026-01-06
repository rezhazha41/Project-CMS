import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Change post_id to string to support UUIDs
      table.string('post_id').notNullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Down migration logic if needed
    })
  }
}