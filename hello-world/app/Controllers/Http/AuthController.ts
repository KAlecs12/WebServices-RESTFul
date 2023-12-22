import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from "App/Validators/RegisterValidator";
import User from "App/Models/User";
import LoginValidator from "App/Validators/LoginValidator";
import Roles from "App/Enums/Roles";
import {DateTime} from "luxon";
import { Limiter } from '@adonisjs/limiter/build/services'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {

  public async register({request, response}: HttpContextContract) {
    const {email, password} = await request.validate(RegisterValidator);
    await User.create({
      email: email,
      password: password,
      role: Roles.ROLE_USER,
    })
    return response.ok({message: "User has been created"});
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const { email = request.input('email'), password = request.input('password') } = await request.validate(LoginValidator);

    const user = await User.findBy("email", email);

    if (!user) {
      return response.notFound({ message: "No user exists with this email"});
    }

    const throttleKey = `login_${email}_${request.ip()}`

    const limiter = Limiter.use({
      requests: 3,
      duration: '5 mins',
      blockDuration: '30 mins',
    })

    if (await limiter.isBlocked(throttleKey)) {
      return response.tooManyRequests('Too many login attempts. Please try after some time')
    }

    try {
      await auth.attempt(email, password)
    } catch (error) {
      await limiter.increment(throttleKey)
      throw error
    }

    await limiter.delete(throttleKey)

    const check_tokens = await Database.query()
      .from('api_tokens')
      .where('user_id', user.id)

    if (check_tokens) {
      await Database.from('api_tokens')
        .where('user_id', user.id)
        .delete();
    }

    const token = await auth.use('api').attempt(email, password, {
      name: 'Access Token',
      expiresIn: '60mins'
    });

    const refreshToken = await auth.use('api').generate(user, {
      name: 'Refresh Token',
      expiresIn: '120mins'
    });

    return response.ok({ accessToken: 'string', accessTokenExpiresAt: token.expiresAt , refreshToken: 'string', refreshTokenExpiresAt: refreshToken.expiresAt });
  }

  public async validate({ request, response }: HttpContextContract) {
    const tokenValue = request.param('accessToken');

    const checkToken = await Database.query().from('api_tokens').where('token', tokenValue).first();

    if (!checkToken) {
      return response.notFound({ message: 'Token not found' });
    }

    const now = DateTime.now();

    if (checkToken.expires_at > now) {
      return response.ok({ accessToken: 'string', accessTokenExpiresAt: checkToken.expires_at });
    } else {
      return response.badRequest({ message: 'Token has expired' });
    }
  }

  public async refresh({ request, auth, response }: HttpContextContract) {

    const token = request.param('refreshToken');

    const { email = request.input('email'), password = request.input('password') } = await request.validate(LoginValidator);

    const user = await User.findBy("email", email);

    if (!user) {
      return response.notFound({ message: "No user exists with this email"});
    }

    await Database.query()
      .from('api_tokens')
      .where('token', token)
      .first();

    await Database.from('api_tokens')
      .where('user_id', user.id)
      .delete();

    const accessToken = await auth.use('api').attempt(email, password, {
      name: 'Access Token',
      expiresIn: '60mins'
    });

    const refreshToken = await auth.use('api').generate(user, {
      name: 'Refresh Token',
      expiresIn: '120mins'
    });

    return response.ok({ accessToken: 'string', accessTokenExpiresAt: accessToken.expiresAt , refreshToken: 'string', refreshTokenExpiresAt: refreshToken.expiresAt });
  }
}
