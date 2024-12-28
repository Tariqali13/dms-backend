<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.
</p>

<p align="center">
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank">
    <img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" />
  </a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank">
    <img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" />
  </a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank">
    <img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/>
  </a>
  <a href="https://opencollective.com/nest#backer" target="_blank">
    <img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" />
  </a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank">
    <img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" />
  </a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank">
    <img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/>
  </a>
  <a href="https://opencollective.com/nest#sponsor"  target="_blank">
    <img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"/>
  </a>
  <a href="https://twitter.com/nestframework" target="_blank">
    <img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"/>
  </a>
</p>

---

## Description

This is a [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository. It demonstrates a sample server-side application that interacts with PostgreSQL, MongoDB, Redis, and an external currency exchange API.

## Prerequisites

- **Node.js** (>= 14.x recommended)
- **npm** (or **yarn**, if you prefer)
- **PostgreSQL** installed and running
- **MongoDB** installed and running
- **Redis** installed and running (or a hosted Redis URL)

## Environment Variables

Before running the application, you must create a `.env` file in the root directory with the following keys (and your own values where appropriate):

```bash
# .env

EXCHANGE_RATE_API_KEY=8cc536b01c3cdadcc3fff8a6
EXCHANGE_RATE_BASE_URL=https://v6.exchangerate-api.com/v6

# -- Postgres Settings --
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123
POSTGRES_DB=wallet_db

# -- MongoDB Settings --
MONGO_URI=mongodb://localhost:27017/wallet

# -- Redis Settings --
REDIS_URL=redis://localhost:6379

Note: You can rename .env to whatever you like (e.g., .env.development) as long as your NestJS ConfigModule.forRoot() is configured accordingly, but .env is the default.

Setting up PostgreSQL
Install PostgreSQL if you haven’t already:

Mac (Homebrew): brew install postgresql
Ubuntu/Debian: sudo apt-get update && sudo apt-get install postgresql postgresql-contrib
Windows: Download Installer
Start PostgreSQL and make sure it’s running.

Create a database (if not already created). For example:

bash
Copy code
psql -U postgres
CREATE DATABASE wallet_db;
Check your .env matches your local DB settings:

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123
POSTGRES_DB=wallet_db
Setting up MongoDB
Install MongoDB if you haven’t already:

Mac (Homebrew):
bash
Copy code
brew tap mongodb/brew
brew install mongodb-community@6.0
Ubuntu/Debian:
bash
Copy code
sudo apt-get update
sudo apt-get install -y mongodb-org
Windows: Download Installer
Start MongoDB. For example:

bash
Copy code
sudo service mongod start
Check that MongoDB is running:

bash
Copy code
mongo
You should see the MongoDB shell if everything is up.

Ensure your .env has the correct URI:

MONGO_URI=mongodb://localhost:27017/wallet
Setting up Redis
Install Redis:
Mac (Homebrew): brew install redis
Ubuntu/Debian: sudo apt-get install redis-server
Windows: Use WSL, Docker, or a third-party build.
Start Redis. For example:
bash
Copy code
redis-server
Check your .env:
REDIS_URL=redis://localhost:6379
Installation
Once you have the services up and running, install all dependencies:

bash
Copy code
npm install
Running the app
bash
Copy code
# development
npm run start

# watch mode (development hot-reload)
npm run start:dev

# production mode (compiled)
npm run start:prod
Test
bash
Copy code
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
Support
Nest is an MIT-licensed open source project. It can grow thanks to sponsors and support by the amazing backers. If you’d like to join them, please read more here.

Stay in Touch
Author - Kamil Myśliwiec
Website - https://nestjs.com
Twitter - @nestframework
License
Nest is MIT licensed.