import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Film from "App/Models/Film";
require('xml2js');
export default class FilmsController {

  private async generateResponse({ request, response, data, status = 200 }) {
    const xmlBuilder = require('xmlbuilder');
    const acceptHeader = request.header('Content-Type');

    const buildXml = (data) => {
      const root = xmlBuilder.create('response');

      if (data.films && Array.isArray(data.films)) {
        // Handling paginated film data
        const paginationInfo = root.ele('pagination');
        paginationInfo.ele('total', data.total);
        paginationInfo.ele('perPage', data.perPage);
        paginationInfo.ele('currentPage', data.currentPage);
        paginationInfo.ele('lastPage', data.lastPage);

        const filmsElement = root.ele('films');
        data.films.forEach(film => {
          const filmElement = filmsElement.ele('film', { id: film.id });
          filmElement.ele('name', film.name);
          filmElement.ele('description', film.description);
          filmElement.ele('release', film.releaseDate);
          filmElement.ele('note', film.note);
        });
      } else if (data.message) {
        // Handling an error message
        root.ele('error', data.message);
      } else {
        // Handling a single film object
        const filmElement = root.ele('film', { id: data.id });
        filmElement.ele('name', data.name);
        filmElement.ele('description', data.description);
        filmElement.ele('release', data.releaseDate);
        filmElement.ele('note', data.note);
      }

      return root.end({ pretty: true });
    };

    if (acceptHeader && acceptHeader.includes('application/xml')) {
      let xml = buildXml(data);
      return response.header('Content-Type', 'application/xml').status(status).send(xml);
    } else {
      return response.header('Content-Type', 'application/json').status(status).json(data);
    }
  }

  public async index({ response, request }: HttpContextContract) {
    const page = request.input('page', 1);
    const perPage = 10;

    const paginatedFilms = await Film.query().paginate(page, perPage);

    const filmsData = {
      total: paginatedFilms.total,
      perPage: paginatedFilms.perPage,
      currentPage: paginatedFilms.currentPage,
      lastPage: paginatedFilms.lastPage,
      films: paginatedFilms.toJSON().data
    };

    return this.generateResponse({ request, response, data: filmsData });
  }

  public async findByName({ params, response, request }: HttpContextContract) {

    const film = await Film.findBy('name', params.name);

    if (!film) {
      return this.generateResponse({
        request,
        response,
        data: { message: 'No films found with the given name' },
        status: 404
      });
    }

    return this.generateResponse({ request, response, data: film });
  }

  async findByDescription({ params, response, request }) {
    const page = request.input('page', 1);
    const perPage = 10;
    const films = await Film.query()
      .where('description', 'LIKE', `%${params.description}%`)
      .paginate(page, perPage);

    if (!films) {
      return this.generateResponse({
        request,
        response,
        data: { message: 'No films found with the given description' },
        status: 404
      });
    }

    const filmsData = {
      total: films.total,
      perPage: films.perPage,
      currentPage: films.currentPage,
      lastPage: films.lastPage,
      films: films.toJSON().data
    };

    return this.generateResponse({ request, response, data: filmsData });
  }

  public async create({ request, response }: HttpContextContract) {
    const filmData = request.only(['name', 'description', 'release_date', 'note']);

    if (filmData.note < 0 || filmData.note > 5) {
      return this.generateResponse({
        request,
        response,
        data: { message: 'Note must be between 0 and 5' },
        status: 406
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
    return this.generateResponse({ request, response, data: { message: 'Film deleted' } });
  }
}
