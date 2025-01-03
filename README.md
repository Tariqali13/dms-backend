# DMS Backend

A **progressive backend framework** built with **Node.js** and **TypeScript**, designed for efficient and scalable server-side applications. This repository provides a starting point for applications interacting with **PostgreSQL**, **MongoDB**, **Redis**, and an external **currency exchange API**.

---

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
    - [PostgreSQL](#postgresql)
    - [MongoDB](#mongodb)
    - [Redis](#redis)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [Support](#support)
- [License](#license)

---

## Features
- Built with **Nest.js**, a progressive Node.js framework.
- Integration with:
  - PostgreSQL for relational database management.
  - MongoDB for NoSQL database operations.
  - Redis for caching and session storage.
  - An external **currency exchange API**.
- Scalable, type-safe, and production-ready.

---

## Prerequisites
Ensure the following dependencies are installed on your system:
- **Node.js** (v14.x or later recommended)
- **npm** (or **yarn**, if preferred)
- **PostgreSQL** (installed and running)
- **MongoDB** (installed and running)
- **Redis** (installed and running or hosted)

---


## Admin Credentials
- Email:  admin@dms.com
- Password: admin123

## Setup Instructions

### Environment Variables
Create a `.env` file in the project root directory with the following configuration:

```plaintext
# Currency Exchange API
EXCHANGE_RATE_API_KEY=<Your-Exchange-Rate-API-Key>
EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v6

# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<Your-Postgres-Password>
POSTGRES_DB=wallet_db

# MongoDB URI
MONGO_URI=mongodb://localhost:27017/wallet

# Redis URL
REDIS_URL=redis://localhost:6379
```

### Database Setup

#PostgreSQL
- **Install PostgreSQL**:
- **MacOS**:
    - brew install postgresql
- **Ubuntu/Debian**:
    - sudo apt-get update
    - sudo apt-get install postgresql postgresql-contrib
- **Windows**:
    - Download PostgreSQL installer

### Create Database:
- **sql**: 
    - CREATE DATABASE wallet_db;
**Ensure PostgreSQL is running**

- **MongoDB**
    - Install MongoDB:

- **MacOS**:
    - brew tap mongodb/brew && brew install mongodb-community@6.0
- **Ubuntu/Debian**:
    - sudo apt-get update
    - sudo apt-get install -y mongodb-org
- **Windows**:
    - Download MongoDB installer

**Start MongoDB Service:**
- sudo service mongod start

**Verify MongoDB is running.**

- **Redis**
    - Install Redis:
- **MacOS**:
    - brew install redis
- **Ubuntu/Debian**:
    - sudo apt-get install redis-server
- **Windows**:
    - Install Redis for Windows

- **Start Redis Server**
    - redis-server
**Verify Redis is running.**

### Installation
Once all services are up and running:

- Clone the repository:
- git clone https://github.com/<your-repo>/dms-backend.git
- cd dms-backend
- Install dependencies:
``` plaintext
npm install

Running the App:

Development Mode: npm run start:dev
Production Mode: npm run start:prod
```

This is an MIT-licensed open-source project. Contributions, issues, and feature requests are welcome!

### Author: Tariq Ali
### License
This project is licensed under the MIT License.