import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Film from "App/Models/Film";
const xml2js = require('xml2js');

export default class FilmsController {

  private async generateResponse({ request, response, data, status = 200 }) {
    const contentType = request.is(['json', 'xml']);

    if (contentType === 'xml') {
      const builder = new xml2js.Builder();
      const xml = builder.buildObject(data);

      response.header('Content-Type', 'application/xml');
      response.status(status);
      return response.send(xml);
    } else {
      // Par défaut, renvoie une réponse JSON
      response.header('Content-Type', 'application/json');
      response.status(status);
      return response.json(data);
    }
  }

  public async index({ response, request }: HttpContextContract) {
    const films = await Film.all();
    return this.generateResponse({ request, response, data: films });  }

  // public async show({ params, response }: HttpContextContract) {
  //   const film = await Film.find(params.id);
  //   if (!film) {
  //     return response.status(404).json({ message: 'Film not found' });
  //   }
  //   return response.json(film);
  // }


  public async findByName({ params, response, request }: HttpContextContract) {
    const film = await Film.findBy('name', params.name);
    if (!film) {
      return this.generateResponse({
        request,
        response,
        data: { message: 'Film not found' }
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
        data: { message: 'Note must be between 0 and 5' }
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
        data: { message: 'Film not found' }
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
        data: { message: 'Film not found' }
      });
    }
    await film.delete();
    return this.generateResponse({ request, response, data: { message: 'Film deleted' } });
  }
}
