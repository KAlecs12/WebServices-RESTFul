import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DocsController {
  public async getDocumentation({ response }: HttpContextContract) {
    const halResponse = {
      _links: {
        self: { href: "/doc" },
        films: {
          href: "/film",
          title: "Access the list of films",
          methods: ["GET"]
        },
        filmById: {
          href: "/film/id/{id}",
          templated: true,
          title: "Get information about a specific film by its ID",
          methods: ["GET"]
        },
        filmByName: {
          href: "/film/name/{name}",
          templated: true,
          title: "Search for films by name",
          methods: ["GET"]
        },
        filmByDescription: {
          href: "/film/description/{description}",
          templated: true,
          title: "Search for films by description",
          methods: ["GET"]
        },
        createFilm: {
          href: "/film",
          title: "Create a new film record",
          methods: ["POST"]
        },
        updateFilm: {
          href: "/film/{id}",
          templated: true,
          title: "Update an existing film record",
          methods: ["PATCH"]
        },
        deleteFilm: {
          href: "/film/{id}",
          templated: true,
          title: "Delete a specific film record",
          methods: ["DELETE"]
        },
        categories: {
          href: "/category",
          title: "Access film categories",
          methods: ["GET"]
        },
        categoryMovies: {
          href: "/category/{name}",
          templated: true,
          title: "Get movies by category name",
          methods: ["GET"]
        }
      },
      _embedded: {
        // You can embed additional resources or information here if needed
      },
      welcomeMessage: "Welcome to the API. Use the links to navigate."
    };

    return response.json(halResponse);
  }
}
