# Films API

Cette API permet de gérer une collection de films. Elle offre des fonctionnalités pour lister, rechercher, créer, mettre à jour et supprimer des films. Les réponses peuvent être retournées au format JSON ou XML, selon le header `Accept` envoyé dans la requête.

## Routes

### Lister tous les films

- **Endpoint** : `GET /films`
- **Description** : Renvoie une liste de tous les films.

### Rechercher un film par id

- **Endpoint** : `GET /films/id/:id`
- **Description** : Recherche un film par son id. Renvoie les détails du film correspondant.
- **Paramètres URL** :
  - `id`: L'id du film à rechercher.

### Rechercher un film par nom

- **Endpoint** : `GET /films/:name`
- **Description** : Recherche un film par son nom. Renvoie les détails du film correspondant.
- **Paramètres URL** :
    - `name`: Le nom du film à rechercher.

### Créer un nouveau film

- **Endpoint** : `POST /films`
- **Description** : Crée un nouveau film avec les données fournies.
- **Corps de la requête (format JSON)** :
  ```json
  {
    "name": "Nom du film",
    "description": "Description du film",
    "release_date": "Date de sortie",
    "note": Note du film
  }
  ```
    - `name`: Nom du film (obligatoire).
    - `description`: Description du film.
    - `release_date`: Date de sortie du film.
    - `note`: Note du film (doit être entre 0 et 5).

### Mettre à jour un film

- **Endpoint** : `PATCH /films/:id`
- **Description** : Met à jour les informations d'un film existant.
- **Paramètres URL** :
    - `id`: ID du film à mettre à jour.
- **Corps de la requête (format JSON)** :
  ```json
  {
    "name": "Nouveau nom",
    "description": "Nouvelle description",
    "release_date": "Nouvelle date de sortie",
    "note": Nouvelle note
  }
  ```

### Supprimer un film

- **Endpoint** : `DELETE /films/:id`
- **Description** : Supprime un film existant.
- **Paramètres URL** :
    - `id`: ID du film à supprimer.

## Gestion des Réponses en JSON et XML

Cette API supporte les réponses en JSON et XML. Le format de la réponse est déterminé par le header `Accept` de la requête :

- Pour recevoir une réponse en JSON, utilisez `Accept: application/json`.
- Pour recevoir une réponse en XML, utilisez `Accept: application/xml`.