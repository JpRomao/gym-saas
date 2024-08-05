<h1 align="center">
  Gym SaaS - In Development
</h1>

## Description

[GymSaas] is a gym management software as a service. It is a platform that allows gym owners to manage their gym, clients, and employees. It is a multi-tenant application, meaning that multiple gyms can use the same instance of the application.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Routes
<p>All routes comes with the header: <strong>Content-Type: application/json</strong></p>

### Admin-only Routes

```
- [POST] /admin/create
{
  "email": "johndoe@example.com",
  "password": "12345678",
  "name": "John Doe"
}
Response Code: 201


- [POST] /admin/authenticate
{
  "email": "johndoe@example.com",
  "password": "12345678",
}

Response Code: 200
```

## License

Gym SaaS is [Apache-2.0 licensed](LICENSE).
