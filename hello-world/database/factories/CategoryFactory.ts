import Factory from '@ioc:Adonis/Lucid/Factory';
import Category from "App/Models/Category";

export const CategoryFactory = Factory
  .define(Category, ({ faker }) => {
    return {
      name: faker.lorem.words(1),
    }
  })
  .build()
