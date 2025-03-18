# Backoffice

## Installation

1. Requirements.

    * [`node 20` or greater must be installed](https://nodejs.org/en/download)

    * [`git 2` or newer must be installed](https://git-scm.com/downloads)

1. Install packages and setup.

    ```sh
    npm i
    ```

1. VS Code recommended settings, add to `.vscode/settings.json`

    ```json
    {
      "typescript.tsdk": "./node_modules/typescript/lib",
      "editor.formatOnSave": true,
      "editor.formatOnPaste": true,
      "editor.codeActionsOnSave": {
          "source.fixAll": "explicit",
          "source.fixAll.eslint": "always"
      }
    }
    ```

## Development

Start development run any rest client to use API <http://localhost:3333/>

```sh
npm run start:dev
```

Check linter issues

```sh
npm run lint
```

Autofix available issues

```sh
npm run lint -- --fix
```

Uses husky for pre-commit and pre-push to autofix all fixable issues and validate types.


### GOD role

POST /api/auth/login

```
{
    "email": "god.user@god.email",
    "password": "111111"
}
```

### ADMIN role

POST /api/auth/login

```
{
    "email": "new.admin@test.com",
    "password": "111111"
}
```

### Create ADMIN

Use GOD user to perform

POST /api/users/admin

```json
{
    "email": "email@domain.com",
    "password": "111111",
    "name": "admin"
}
```

## Production build

```sh
npm run build
```