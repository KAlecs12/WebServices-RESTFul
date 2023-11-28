import { BaseCommand } from '@adonisjs/core/build/standalone'
import { CategoryFactory } from "Database/factories/CategoryFactory";

export default class Fixtures extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'fill:database'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    const { MovieFactory } = await import('Database/Factories/FilmFactory')
    await CategoryFactory.createMany(5);
    await MovieFactory.createMany(100);
    this.logger.info('======== BDD done with fake movies ! ========');
  }
}
