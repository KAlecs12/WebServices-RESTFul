# Films API

Cette API permet de gérer une collection de films. Elle offre des fonctionnalités pour lister, rechercher, créer, mettre à jour et supprimer des films. Les réponses peuvent être retournées au format JSON ou XML, selon le header `Accept` envoyé dans la requête.

## Installation

### Prérequis

Avant de commencer, assurez-vous que vous avez Node.js (version XYZ ou supérieure) et npm installés sur votre machine.

### Clonez le dépôt du projet en utilisant la commande suivante :

`git clone [URL_DU_DEPOT]`

### Installation des dépendances

Après avoir cloné le dépôt, naviguez dans le dossier du projet et installez les dépendances nécessaires :
`cd [NOM_DU_PROJET]`
`npm install`

Pensez à bien compléter le fichier `.env` avec les informations de votre base de données :

- `DB_CONNECTION=mysql`
- `MYSQL_HOST=your_host`
- `MYSQL_USER=your_user`
- `MYSQL_PORT=3306`
- `MYSQL_PASSWORD=your_password`
- `MYSQL_DB_NAME=your_db_name`

Pour lancer le serveur Adonis, exécutez les commandes suivante :

`npm run dev`


Puis remplisser la base de données :

- `node ace migration:fresh`
- `node ace migration:run`
- `node ace fill:database`
- `node ace db:seed`

Le serveur devrait maintenant être opérationnel sur http://localhost:3333.

## Routes

- **Endpoint** : `GET /doc/`
- **Description** : Affiche toutes les informations concernant toutes les routes de l'API ainsi que leurs fonctionnalités.

_(les routes concernant l'authentification n'y sont pas renseignées car ce n'était pas demandé)_

## Gestion des Réponses en JSON et XML

Cette API supporte les réponses en JSON et XML. Le format de la réponse est déterminé par le header `Content-Type` de la requête :

- Pour recevoir une réponse en JSON, utilisez `Content-Type: application/json`.
- Pour recevoir une réponse en XML, utilisez `Content-Type: application/xml`.
