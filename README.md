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

<p><strong>TIP:</strong> You can use rest-client extension in VSCode to test the routes with the client.http file in the root directory.</p>

### Admin-only Routes
```bash
# Create a new admin
- [POST] /admin/create
{
  "email": "string", # Must be an email
  "password": "string",
  "name": "string"
}
Response_Code: 201


# Authenticate an admin
- [POST] /admin/authenticate
{
  "email": "string",
  "password": "string",
}
Response_Code: 200
Response_Body:
{
  "access_token": "string"
}


# Create a new employee for a gym
- [POST] /employees
{
  "gymId": "string",
  "name": "string",
  "cpf": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "city": "string",
  "state": "string",
  "street": "string",
  "number": "string",
  "zipCode": "string",
  "role": 'WORKER' | 'RELATIONED' | 'MANAGER',
  "creatorId": "string"
}
Response_Code: 201


# Authenticate an employee
- [POST] /auth
{
  "email": "string",
  "password": "string"
}
Response_Code: 200
Response_Body:
{
  "access_token": "string"
}
```

## License

Gym SaaS is [Custom Restrictive License - João Pedro da Silva Romão](LICENSE).
