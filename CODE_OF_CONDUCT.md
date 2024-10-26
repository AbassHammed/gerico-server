# Documentation de Gestion du Dépôt GitHub

## Table des Matières

1. [Github](#github)
   - [Explication de GitHub Flow](#explication-de-github-flow)
   - [Exemples de Workflow GitHub Flow](#exemples-de-workflow-github-flow)
   - [Politique de Protection des Branches](#politique-de-protection-des-branches)
2. [Backend](#backend)
   - [Structure du Répertoire Backend](#structure-du-répertoire-backend)
   - [Prérequis](#prérequis)

---

## GitHub

### Explication de GitHub Flow

GitHub Flow est une méthode de gestion des branches légère et flexible, conçue pour les équipes de développement collaboratif. Elle se concentre sur des branches de fonctionnalités indépendantes qui sont ensuite fusionnées dans une branche principale stable.

#### Points Clés de GitHub Flow :

- **Branche principale (`master`)** : La branche `master` est la source de vérité, toujours stable et prête à être déployée en production.
- **Branches de Fonctionnalité** : Chaque changement est effectué sur une branche distincte issue de `master`. Ces branches doivent porter des noms descriptifs, de format `feature/ajout-login-utilisateur` ou `feature-ajoutloginutilisateur`.
- **Pull Request (PR)** : Une fois la fonctionnalité prête, une PR est ouverte pour révision et approbation.
- **Revue de Code et Validation** : Les PR sont examinées par l'équipe. Seules les PR approuvées sont fusionnées dans `master`, les PR peuvent seulement être approuvées par `Jo` et moi .
- **Fusion et Déploiement** : Les PR approuvées sont fusionnées dans `master`.
- **Suppression des Branches** : Après la fusion d'une PR, la branche de fonctionnalité est supprimée (la suppression sera faite automatiquement après le merge) .

### Exemples de Workflow GitHub Flow

#### 1. Création d’une Branche de Fonctionnalité

À partir de `master`, créez une branche pour chaque nouvelle fonctionnalité :

```bash
git checkout master
git pull origin master
git checkout -b feature/ajout-nouvelle-fonctionnalité
```

#### 2. Push de la Branche vers GitHub

Après avoir effectué les modifications et les commits locaux, poussez la branche sur GitHub :

```bash
git add .
git commit -m "Ajout de la fonctionnalité X"
git push origin feature/ajout-nouvelle-fonctionnalite
```

> Si vous essayez de push sur la branche `master` vous aurez une erreur dans le terminal.

#### 3. Création et Revue de la Pull Request (PR)

Rendez-vous sur GitHub, ouvrez une PR pour la nouvelle fonctionnalité, et soumettez-la pour révision.

#### 4. Fusion de la PR et Suppression de la Branche

Une fois approuvée, la PR est fusionnée dans `master` et la branche est supprimée.

### Politique de Protection des Branches

Pour maintenir la stabilité de la branche principale `master`, des protections sont en place. Seuls les **administrateurs** (moi et Jo) avons l’autorisation de push et merge directement dans `master`. Tous les autres membres doivent passer par une Pull Request pour toute modification.

## Backend

### Structure du Répertoire Backend

Le backend est une **application Node.js** développée avec **TypeScript** pour plus de sécurité et de maintenabilité du code. Voici une structure recommandée :

```plaintext
backend/
├── .github/
│   └── workflows/
│       ├── ci.yml          # Configuration de l'intégration continue
│       └── test.yml        # Configuration des workflows de tests
├── src/
│   ├── controllers/        # Logique des fonctionnalités de l'application
│   ├── models/             # Modèles et schémas de données
│   ├── routes/             # Définition des routes API
│   ├── services/           # Services pour les interactions et logiques complexes
│   ├── utils/              # Fonctions utilitaires partagées
│   └── index.ts            # Point d'entrée principal de l'application
├── tests/                  # Dossiers pour les tests unitaires et d'intégration
├── .env                  # Variables d'environnement pour configurer l'application
├── Dockerfile              # Fichier pour la création du conteneur Docker
├── package.json            # Dépendances et scripts du projet
├── .gitignore              # Fichier listant les éléments ignorés par Git
├── .nvmrc                  # Version de Node.js à utiliser
├── eslint.config.mjs         # Configuration pour ESLint (linter du code)
├── .prettierignore         # Fichier listant les éléments ignorés par Prettier
├── .prettierrc             # Configuration pour le formateur de code Prettier
└── tsconfig.json           # Configuration du compilateur TypeScript
```

> Il faut jamais push le fichier `.env` sur GitHub, c'est pour cela que le fichier est écrit dans `.gitignore`

### Prérequis

- **Node.js et npm** : [Installer Node.js et npm](https://nodejs.org/)
- **Docker** : [Installer Docker](https://www.docker.com/) pour la virtualisation d’environnement et faciliter le développement collaboratif.
- **Postman ou Insomnia** : Utiliser [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) pour tester les routes de l'API.
- **IDE Vscode** : Je vous conseille fortement d'utiliser [Vscode](https://code.visualstudio.com/)
  > À la première ouverture du projet sous Vscode, des extensions spécifiques vous seront suggérées. Ces extensions amélioreront votre expérience de développement, avec notamment des outils pour le débogage, le formatage de code et la gestion de projets Node.js et TypeScript.
