import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Film from "App/Models/Film";

export default class FilmsController {
  public async index({ response }: HttpContextContract) {
    const films = await Film.all();
    return response.json(films);
  }

  // public async show({ params, response }: HttpContextContract) {
  //   const film = await Film.find(params.id);
  //   if (!film) {
  //     return response.status(404).json({ message: 'Film not found' });
  //   }
  //   return response.json(film);
  // }

  public async findByName({ params, response }: HttpContextContract) {
    const film = await Film.findBy('name', params.name);
    return response.json(film);
    // // const film = await Film.query().where('name', params.name).first();
    // if (!film) {
    //   return response.status(404).json({ message: 'Film not found' });
    // }
    // return response.json(film);
  }

  public async create({ request, response }: HttpContextContract) {
    // Extracting film data from the request body
    const filmData = request.only(['name', 'description', 'release_date', 'note']);

    // Validating and handling note value
    if (filmData.note < 0 || filmData.note > 5) {
      return response.status(400).json({ message: 'Note must be between 0 and 5' });
    }

    // Creating a new film in the database
    const film = await Film.create(filmData);

    // Returning the created film as a response
    return response.status(201).json(film);
  }


  public async update({ params, request, response }: HttpContextContract) {
    const film = await Film.find(params.id);
    if (!film) {
      return response.status(404).json({ message: 'Film not found' });
    }

    const filmData = request.only(['name', 'description', 'release_date', 'note']);
    film.merge(filmData);
    await film.save();

    return response.json(film);
  }

  public async destroy({ params, response }: HttpContextContract) {
    const film = await Film.find(params.id);
    if (!film) {
      return response.status(404).json({ message: 'Film not found' });
    }
    await film.delete();
    return response.status(204).json({ message: 'Film deleted' });
  }
}
