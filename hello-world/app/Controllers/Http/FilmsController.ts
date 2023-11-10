import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Film from "App/Models/Film";
const xml2js = require('xml2js');

export default class FilmsController {
  /**
   * Génère une réponse en JSON ou XML en fonction du header 'Accept'.
   */
  private async generateResponse({ request, response, data, status = 200 }) {
    const acceptHeader = request.header('Accept');

    if (acceptHeader && acceptHeader.includes('application/xml')) {
      const builder = new xml2js.Builder();
      const xml = builder.buildObject(data);

      response.header('Content-Type', 'application/xml');
      response.status(status);
      return response.send(xml);
    } else {
      response.header('Content-Type', 'application/json');
      response.status(status);
      return response.json(data);
    }
  }

  public async findByName({ params, response, request }: HttpContextContract) {
    const film = await Film.findBy('name', params.name);
    if (!film) {
      return this.generateResponse({
        request,
        response,
        data: { message: 'Film not found' },
        status: 404
      });
    }
    return this.generateResponse({ request, response, data: film });
  }

  public async create({ request, response }: HttpContextContract) {
    const filmData = request.only(['name', 'description', 'release_date', 'note']);

    if (filmData.note < 0 || filmData.note > 5) {
      return this.generateResponse({
        request,
        response,
        data: { message: 'Note must be between 0 and 5' },
        status: 422
      });
    }

    const film = await Film.create(filmData);
    return this.generateResponse({ request, response, data: film, status: 201 });
  }

  public async update({ params, request, response }: HttpContextContract) {
    const film = await Film.find(params.id);
    if (!film) {
      return this.generateResponse({
        request,
        response,
        data: { message: 'Film not found' },
        status: 404
      });
    }

    const filmData = request.only(['name', 'description', 'release_date', 'note']);
    film.merge(filmData);
    await film.save();

    return this.generateResponse({ request, response, data: film });
  }

  public async destroy({ params, request, response }: HttpContextContract) {
    const film = await Film.find(params.id);
    if (!film) {
      return this.generateResponse({
        request,
        response,
        data: { message: 'Film not found' },
        status: 404
      });
    }
    await film.delete();
    return this.generateResponse({ request, response, data: { message: 'Film deleted' }, status: 200 });
  }
}
