import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from "App/Enums/Roles";
import Status from "App/Enums/Status";

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.enum('role', Object.values(Roles)).notNullable().defaultTo(Roles.ROLE_USER)
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.enum('status', Object.values(Status)).notNullable().defaultTo(Status.open)

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
