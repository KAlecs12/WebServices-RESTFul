import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Films extends BaseSchema {
  protected tableName = 'films'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().unique();
      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('CASCADE')
      table.string('name', 128).notNullable();
      table.string('description', 2048).notNullable();
      table.timestamp('release_date').notNullable();
      table.integer('note');
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
