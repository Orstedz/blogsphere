# BlogSphere Backend API

Professional blogging platform backend built with Node.js, Express, and SQL Server.

## Overview

BlogSphere Backend provides RESTful API endpoints for managing:

- Posts and Categories
- Series and Tags
- Users and Roles
- Content management and publishing

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: SQL Server (Code-first migrations)
- **Validation**: Joi
- **Security**: Helmet, CORS

## Installation

### Prerequisites

- Node.js 18+
- SQL Server 2019+
- npm or yarn

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/blogsphere.git
   cd blogsphere
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file in the root directory:

   ```env
   PORT=3001
   DB_SERVER=your_server_address
   DB_NAME=blogsphere
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_ENCRYPT=true
   NODE_ENV=development
   ```

4. Run database migrations:

   ```bash
   npm run migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Categories

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Posts

- `GET /api/posts` - List all posts
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Series

- `GET /api/series` - List all series
- `POST /api/series` - Create series
- `PUT /api/series/:id` - Update series
- `DELETE /api/series/:id` - Delete series

### Users

- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Roles

- `GET /api/roles` - List all roles
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

## Development

- `npm run dev` - Start with hot reload
- `npm run migrate` - Run database migrations

## Production

- `npm start` - Start production server

## Project Structure

```
blogsphere/
├── config/
│   └── database.js
├── routes/
│   ├── categories.js
│   ├── posts.js
│   ├── series.js
│   ├── users.js
│   └── roles.js
├── controllers/
│   ├── categoryController.js
│   ├── postController.js
│   ├── seriesController.js
│   ├── userController.js
│   └── roleController.js
├── models/
│   └── schema.sql
├── middleware/
│   ├── errorHandler.js
│   └── validation.js
├── scripts/
│   └── migrate.js
├── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## License

MIT
