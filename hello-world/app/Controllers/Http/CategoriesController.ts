import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Category from "App/Models/Category";
import Film from "App/Models/Film";


export default class CategoriesController {

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

  public async getCategoryMovies({ request, response, params }: HttpContextContract) {

    const categoryName = params.name;
    const category = await Category.findBy('name', categoryName);

    if (category) {
      const page = request.input('page', 1);
      const perPage = 10;

      const films = await Film.query()
        .where('category_id', category.id)
        .paginate(page, perPage);

      const filmsData = {
        total: films.total,
        perPage: films.perPage,
        currentPage: films.currentPage,
        lastPage: films.lastPage,
        films: films.toJSON().data
      };

      return this.generateResponse({ request, response, data: filmsData });
    }

    return this.generateResponse({
      request,
      response,
      data: { message: 'No categories found with the given name' },
      status: 404
    });
  }
}
