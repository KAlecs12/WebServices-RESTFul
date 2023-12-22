import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EnsureAdmin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // @ts-ignore
    if (auth.user && auth.user.role === 'ROLE_ADMIN') {
      await next()
    } else {
      return response.forbidden({ message: 'Access denied. You must be an admin to perform this action' })
    }
  }
}
