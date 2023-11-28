import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid';

export default class Film extends BaseModel {
  @column({ isPrimary: true })
  public id: string = uuid()

  @column()
  public name: string

  @column()
  public description: string

  @column.dateTime()
  public releaseDate: DateTime

  @column()
  public note: number

}

module.exports = Film;
