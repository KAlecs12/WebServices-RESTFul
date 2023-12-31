/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'FilmsController.index')
  Route.get('/id/:id', 'FilmsController.show');
  Route.get('/name/:name', 'FilmsController.findByName');
  Route.get('/description/:description', 'FilmsController.findByDescription');
  Route.post('/', 'FilmsController.create').middleware(["ensureAdmin"]);
  Route.patch('/:id', 'FilmsController.update').middleware(["ensureAdmin"]);
  Route.delete('/:id', 'FilmsController.destroy').middleware(["ensureAdmin"]);
}).prefix('film').middleware(["auth"])

Route.group(() => {
  Route.get('/:name', 'CategoriesController.getCategoryMovies');
}).prefix('category').middleware(["auth"])

Route.group(() => {
  Route.get('/', 'DocsController.getDocumentation');
}).prefix('doc')

Route.group(() => {
  Route.post('/account', 'AuthController.register');
  Route.get('account/:uid', 'AuthController.showUser').middleware(["auth"])
  Route.put('account/:uid', 'AuthController.editUser').middleware(["auth"])
  Route.post('/token', 'AuthController.login');
  Route.post('/refresh-token/:refreshToken/token', 'AuthController.refresh');
  Route.get('/validate/:accessToken', 'AuthController.validate');
}).prefix('api')
