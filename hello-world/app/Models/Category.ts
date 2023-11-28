import {BaseModel, column, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import Film from "App/Models/Film";

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @hasMany(() => Film)
  public movies: HasMany<typeof Film>
}
