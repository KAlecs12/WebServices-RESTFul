import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { belongsTo } from "@adonisjs/lucid/build/src/Orm/Decorators";
import Category from "App/Models/Category";
import { v4 as uuid } from 'uuid';

export default class Film extends BaseModel {
  @column({ isPrimary: true })
  public id: string = uuid()

  @column()
  public categoryId: number

  @column()
  public name: string

  @column()
  public description: string

  @column.dateTime()
  public releaseDate: DateTime

  @column()
  public note: number

  @belongsTo(() => Category)
  public categories: BelongsTo<typeof Category>

}

module.exports = Film;
