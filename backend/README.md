# Library Management System — Backend

Backend API for the Library Management System, built with **NestJS**, **Prisma**, and **PostgreSQL (Neon)**.

The backend provides authentication, role-based authorization, book management, borrowing management, user listing, and dashboard statistics.

## Tech Stack

- **NestJS**
- **Prisma ORM**
- **PostgreSQL**
- **Neon PostgreSQL**
- **JWT** authentication
- **Passport / passport-jwt**
- **bcrypt**
- **Swagger / OpenAPI**
- **class-validator / class-transformer**

## Features

### Authentication
- Login for registered users
- JWT access tokens
- Password verification using bcrypt
- Role-based authentication and authorization
- Protected endpoints using JWT guards
- Admin/User role restrictions

### Books
Admins can:
- Create books
- View books
- Update books
- Remove books

Authenticated users can:
- Browse books
- Search books by title, author, or ISBN
- View book details and availability

Book fields:

- `id`
- `title`
- `author`
- `isbn`
- `category`
- `totalCopies`
- `availableCopies`
- `deletedAt`
- `createdAt`
- `updatedAt`

### Borrowings
The backend supports:

- Borrowing available books
- Preventing borrowing when `availableCopies` is `0`
- Preventing duplicate active borrowing of the same book by the same user
- Automatically decreasing available copies when borrowing
- Returning books
- Automatically increasing available copies when returning
- Preserving returned borrowing records as history
- Restricting returns to the user who owns the borrowing
- Admin access to library-wide borrowing activity

Borrowing operations that update both the borrowing and book records are handled inside Prisma transactions.

### Users
Admins can view all registered users.

Returned user data intentionally excludes `passwordHash`.

### Dashboard

#### Admin dashboard
Returns:

- `totalBooks`
- `totalCopies`
- `availableCopies`
- `borrowedCopies`
- `totalUsers`
- `activeBorrowings`

#### User dashboard
Returns:

- `currentBooks`
- `activeCount`
- `recentHistory`

## Role Permissions

| Operation | Admin | User |
|---|:---:|:---:|
| Login | ✅ | ✅ |
| View books | ✅ | ✅ |
| Search books | ✅ | ✅ |
| View book details | ✅ | ✅ |
| Create book | ✅ | ❌ |
| Update book | ✅ | ❌ |
| Delete book | ✅ | ❌ |
| Borrow book | ✅* | ✅ |
| Return own borrowing | ✅* | ✅ |
| View own borrowings | ✅ | ✅ |
| View all borrowings | ✅ | ❌ |
| View registered users | ✅ | ❌ |
| View dashboard | ✅ | ✅ |

`*` Access depends on the endpoint protection and authenticated role configuration.

## API Endpoints

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/auth/login` | Public |

### Books

| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/books` | Authenticated |
| `GET` | `/books/:id` | Authenticated |
| `POST` | `/books` | Admin |
| `PATCH` | `/books/:id` | Admin |
| `DELETE` | `/books/:id` | Admin |

### Borrowings

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/borrowings` | Authenticated User |
| `PATCH` | `/borrowings/:id/return` | Authenticated User |
| `GET` | `/borrowings/me` | Authenticated User |
| `GET` | `/borrowings` | Admin |

### Users

| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/users` | Admin |

### Dashboard

| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/dashboard` | Admin / User |

## Database Design

The backend uses three main models:

### User

- `id`
- `name`
- `email`
- `passwordHash`
- `role`
- `createdAt`
- `updatedAt`

### Book

- `id`
- `title`
- `author`
- `isbn`
- `category`
- `totalCopies`
- `availableCopies`
- `deletedAt`
- `createdAt`
- `updatedAt`

### Borrowing

- `id`
- `userId`
- `bookId`
- `borrowedAt`
- `returnedAt`
- `status`
- `createdAt`
- `updatedAt`

### Relationships

```text
User 1 ────────< Borrowing >──────── 1 Book
```

A user can have many borrowing records, and a book can have many borrowing records.

## Important Business Rules

- ISBN values must be unique.
- A book must have at least one total copy.
- Available copies cannot go below zero.
- A user cannot have more than one active borrowing for the same book.
- A book cannot be borrowed when no copies are available.
- Returning a book restores one available copy.
- Only the borrower can return their active borrowing.
- Returned borrowing records remain in the database as history.
- Books with active borrowings cannot be removed.
- Deleted books cannot appear in the normal book catalog.
- Deleted books cannot be borrowed.
- Admin-only operations are protected by role guards.

## Soft Delete

Books use **soft deletion**.

When an admin removes a book, the backend does not physically delete the database row. Instead:

```text
deletedAt = current timestamp
```

The book is then excluded from normal book queries.

This preserves historical borrowing records and avoids foreign-key conflicts with the `Borrowing` table.

Existing borrowing history remains available after a book is removed.

## Project Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   ├── seed.ts
│   └── prisma.config.ts
│
├── src/
│   ├── auth/
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   │
│   ├── books/
│   │   ├── dto/
│   │   ├── books.controller.ts
│   │   ├── books.module.ts
│   │   └── books.service.ts
│   │
│   ├── borrowings/
│   │   ├── dto/
│   │   ├── borrowings.controller.ts
│   │   ├── borrowings.module.ts
│   │   └── borrowings.service.ts
│   │
│   ├── dashboard/
│   │   ├── dashboard.controller.ts
│   │   ├── dashboard.module.ts
│   │   └── dashboard.service.ts
│   │
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   └── main.ts
│
├── .env
├── .env.example
├── package.json
└── README.md
```

## Environment Variables

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL="your-neon-database-url"
JWT_SECRET="your-jwt-secret"
```

Do not commit real secrets.

Use `.env.example` as the environment variable template.

## Installation

From the repository root:

```bash
cd backend
npm install
```

## Prisma Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Apply database migrations:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
npx prisma db seed
```

Prisma migrations are stored under:

```text
prisma/migrations/
```

After changing `schema.prisma`, create a named migration:

```bash
npx prisma migrate dev --name <migration-name>
```

Then regenerate the client:

```bash
npx prisma generate
```

## Seeded Accounts

The seed includes the following development accounts.

### Admin

```text
Email: admin@email.com
Password: Admin123!
Role: ADMIN
```

### User

```text
Email: user@email.com
Password: User123!
Role: USER
```

These credentials are for development/testing only.

## Running the Backend

Development:

```bash
npm run start:dev
```

The API runs on:

```text
http://localhost:3001
```

## Swagger

Swagger / OpenAPI documentation is available at:

```text
http://localhost:3001/api
```

Use the **Authorize** button in Swagger to provide the JWT access token returned from `/auth/login`.

## Validation and Error Handling

The backend uses request validation and consistent HTTP status codes.

Common responses:

| Status | Meaning |
|---|---|
| `200` | Request completed successfully |
| `201` | Resource created successfully |
| `400` | Invalid request data |
| `401` | Authentication required or invalid |
| `403` | Insufficient permissions |
| `404` | Resource not found |
| `409` | Business-rule conflict |

Examples of business-rule conflicts include:

- Duplicate ISBN
- Borrowing an unavailable book
- Duplicate active borrowing
- Returning an already-returned borrowing
- Removing a book with an active borrowing

## Manual Testing

The backend was manually tested through Swagger and through the integrated application.

Tested areas include:

- Admin login
- User login
- Book CRUD
- Book search
- Duplicate ISBN handling
- Borrowing available books
- Blocking unavailable books
- Blocking duplicate active borrowings
- Returning books
- Preventing unauthorized returns
- Borrowing history
- Admin borrowing activity
- Admin user listing
- Admin dashboard
- User dashboard
- Role-based access restrictions
- Soft-deleted book behavior

## Development Notes

- Prisma is used as the ORM for PostgreSQL.
- The PostgreSQL database is hosted on Neon.
- JWT is used for stateless authentication.
- Passwords are stored as bcrypt hashes.
- Role guards protect Admin-only resources.
- Borrowing and returning use database transactions to keep book availability and borrowing state consistent.
- Historical borrowing records are preserved.
- Soft-deleted books are excluded from normal catalog queries.

## Git Workflow

For database schema changes:

```bash
npx prisma migrate dev --name <migration-name>
npx prisma generate
```

Then commit the schema, migration, and related backend changes.

For normal code changes:

```bash
git add .
git commit -m "your commit message"
git push origin main
```

## License

This backend was developed as part of an educational Library Management System project.