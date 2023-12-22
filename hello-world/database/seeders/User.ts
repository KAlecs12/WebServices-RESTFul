// database/seeders/User.ts

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Roles from 'App/Enums/Roles'

export default class UserSeeder extends BaseSeeder {
  public async run () {

    await User.create({
      email: 'user@example.com',
      password: 'userpassword',
      role: Roles.ROLE_USER
    })

    await User.create({
      email: 'admin@example.com',
      password: 'adminpassword',
      role: Roles.ROLE_ADMIN
    })
  }
}
