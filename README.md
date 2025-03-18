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

Copy ENV variables file `.env.example` to `.env`, 

```sh
cp .env.example .env
```

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

```json
{
    "email": "god@god.email",
    "password": "AA1111"
}
```

### ADMIN role

POST /api/auth/login

```json
{
    "email": "new.admin@test.com",
    "password": "AA1111"
}
```

### Create ADMIN

Use GOD user to perform

POST /api/users/admin

```json
{
    "email": "email@domain.com",
    "password": "AA1111",
    "name": "admin"
}
```

### Use Authorized user for RestAPI-client (JWT)

After logged in

*POST /api/auth/login*

```json
{
    "email": "god.user@god.email",
    "password": "AA1111"
}
```

Recived JWT (token)

```json
{
    "expires": 36000,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2Q5OTkzYWI4MTAyOTZhYjkwMzAyYmQiLCJlbWFpbCI6ImdvZC51c2VyQGdvZC5lbWFpbCIsImlhdCI6MTc0MjMxMzkyNiwiZXhwIjoxNzQyMzQ5OTI2fQ.Khq0u0X289aVsmPOT88kYdW7GfxAeNrrhEs2r3rdqBs"
}
```

Open RestAPI-client, go to Headers section/tab and add `token` (from /api/auth/login response) to Authorization header

```json
{ "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2Q5OTkzYWI4MTAyOTZhYjkwMzAyYmQiLCJlbWFpbCI6ImdvZC51c2VyQGdvZC5lbWFpbCIsImlhdCI6MTc0MjMxMzkyNiwiZXhwIjoxNzQyMzQ5OTI2fQ.Khq0u0X289aVsmPOT88kYdW7GfxAeNrrhEs2r3rdqBs" }
```

## Production build

```sh
npm run build
```

## Generate documentation

Generate and run documentation server

```sh
npm run typedocs
```

[Open documentation](http://127.0.0.1:8080/index.html)
