# Online Course Platform API

Production-oriented REST API for an online course platform, built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **ES Modules**. It follows an **MVC-style layout** with services for business logic, centralized errors, JWT authentication, and role-based authorization.

## Features

- User registration and login with **bcrypt** password hashing and **JWT** sessions
- **Courses**: CRUD for instructors, pagination, title search, and category filtering
- **Lessons**: nested under courses (create by instructor, list publicly)
- **Enrollments**: students enroll and list their courses
- **Comments**: students comment on lessons; public listing with pagination
- **Ratings**: students rate enrolled courses (1–5); aggregated `averageRating` / `ratingCount` on courses
- **Lesson progress**: students track `progressPercent`, `completed`, and `lastPositionSec` per lesson (enrollment required)
- **Security**: Helmet, CORS, rate limiting (global + stricter auth routes), `dotenv` configuration
- **Validation**: `express-validator` on inputs
- **Errors**: centralized handler with consistent JSON responses

### Response shape

**Success**

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

**Error**

```json
{
  "success": false,
  "data": {},
  "message": "Error description",
  "errors": ["optional validation messages"]
}
```

## Requirements

- Node.js **18+**
- MongoDB **6+** (local or Atlas)

## Setup

1. Clone or copy this project and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file from the example:

   ```bash
   copy .env.example .env
   ```

   On Unix-like systems use `cp .env.example .env`.

3. Set **strong** values for `JWT_SECRET` and a working `MONGODB_URI`.

4. Start the server:

   ```bash
   npm run dev
   ```

   Or production:

   ```bash
   npm start
   ```

5. Health check: `GET http://localhost:5000/health`

## API overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/courses` | — | List courses (`page`, `limit`, `search`, `category`) |
| POST | `/api/courses` | Instructor | Create course |
| PUT | `/api/courses/:id` | Instructor | Update own course |
| DELETE | `/api/courses/:id` | Instructor | Delete own course (+ related data) |
| POST | `/api/courses/:courseId/lessons` | Instructor | Add lesson |
| GET | `/api/courses/:courseId/lessons` | — | List lessons |
| POST | `/api/enrollments` | Student | Body: `{ "courseId" }` |
| GET | `/api/enrollments/my-courses` | Student | Enrolled courses |
| POST | `/api/lessons/:lessonId/comments` | Student | Body: `{ "text" }` |
| GET | `/api/lessons/:lessonId/comments` | — | List comments (`page`, `limit`) |
| POST | `/api/courses/:courseId/ratings` | Student | Body: `{ "value": 1-5 }` (must be enrolled) |
| GET | `/api/courses/:courseId/ratings` | Optional | Summary; `myRating` if Student JWT |
| PUT | `/api/lessons/:lessonId/progress` | Student | Body: any of `progressPercent`, `completed`, `lastPositionSec` |
| GET | `/api/lessons/:lessonId/progress` | Student | Current progress |

Use header: `Authorization: Bearer <token>` for protected routes.

## Roles

- **Instructor**: create/update/delete **own** courses; add lessons to own courses.
- **Student**: enroll, comment, rate **enrolled** courses, update **progress** for lessons in enrolled courses.

## Postman

Import `postman/Online-Course-Platform.postman_collection.json`. Set collection variables:

- `baseUrl`: e.g. `http://localhost:5000`
- `token`: paste JWT after login/register

## Project structure

```text
src/
  app.js
  server.js
  config/
  controllers/
  middlewares/
  models/
  routes/
  services/
  utils/
```

## License

MIT
