# Library Management System API

This project involves building a comprehensive Library Management System (LMS) where users can browse and borrow books, manage their accounts, and interact with library staff. The platform is designed to provide a seamless experience for both library patrons and administrators.

The objective is to develop a scalable and efficient API that enables users to explore books, check their availability, borrow and return books, and manage their library accounts. The API is built to support various front-end applications, including web and mobile interfaces.

In today's digital age, efficient library management is crucial for educational institutions and public libraries. This project aims to simplify access to library resources while giving administrators the necessary tools to manage book collections and user accounts effectively.

## Table of Contents

- [Live url](#url)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Setup](#project-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
  - [Database Migrations](#database-migrations)
- [API Documentation](#api-documentation)
- [Acknowledgement](#Acknowledgement)
- [Contributing](#contributing)
- [License](#license)

## Live url

-

## Features

- User Registration & Authentication: Allows users to create accounts, log in, and manage their profiles.
- Book Browsing: Users can search for available books, view details like genre, description, and author.
- Borrowing Books: Users can borrow books if available, with due dates and borrowing limits.
- Renewing Books: Users can extend the borrowing period by renewing their books if there are available copies, they are within the borrow period and no reservations will be affected.
- Book Reservation: Users can reserve books if they are currently unavailable and they can add the date it is needed. Reserved books will be made available once returned.
- Account Management: Users can update their profiles and check their borrowing history.
- Admin Controls: Admins can manage book collections, users, fines.

## Technology Stack

- **Backend:** Node.js with Express.js, Redis for background job
- **Database:** PostgreSQL with Prisma
- **Hosting:** Render

## Project Setup

### Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [Yarn](https://yarnpkg.com/) (v1.x)
- [PostgreSQL](https://www.postgresql.org/) (Ensure the database is running and accessible)
- Ensure redis is running on your system or server.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/LivingHopeDev/library-management-system-API.git
   cd library-management-system-API
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

### Environment Variables

Create a `.env` file in the root of the project and configure the following environment variables:
Check `.env.example ` file

```env
PORT=yourPortNumber
NODE_ENV=development
AUTH_SECRET=yourSecretKey
AUTH_EXPIRY=7d
DATABASE_URL=postgresql://postgres:yourDbPassword@yourhost:yourDbport/dbName


```

### Running the Application

#### Start the development server

```
yarn run start:dev

```

#### Access the application

The server will start on the specified PORT in your .env file. If PORT is set to 8000, the application will be available at <http://localhost:8070>.

#### Database Migrations

```
yarn prisma migrate dev
```

### API Documentation

Visit the url below to view the documentation
``
`localhost:8070/api/docs`

### Acknowledgement

- **Idea Source:** The idea for this Library Management System was inspired by Solomon Eseme, the founder of Mastering Backend. `https://app.masteringbackend.com/projects/build-your-own-library-management-system`

### Contributing

Contributions are welcome!

### License

This project is licensed under the MIT License - see the LICENSE file for details.

### Key Points

- The `README.md` provides a comprehensive guide on setting up the project locally, including installation instructions, environment variable configuration, and starting the server.
- Since the API documentation is not yet available, it includes a placeholder indicating that it will be provided later.
- The setup instructions are tailored specifically for a Node.js and PostgreSQL environment using Yarn.

This `README.md` file should serve as a solid foundation for your project documentation. Let me know if you need any changes or additional information!
