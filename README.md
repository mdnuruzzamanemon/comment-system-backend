# Comment System Backend

A professional Node.js backend for a real-time comment system with JWT authentication.

## Features

- ✅ JWT Authentication (Signup & Login)
- ✅ Modular Architecture (Routes, Controllers, Services, DAL)
- ✅ MongoDB Integration
- ✅ Input Validation
- ✅ Password Hashing
- ✅ Protected Routes
- 🚧 Comment CRUD Operations (Coming Soon)
- 🚧 Real-time Updates with WebSockets (Coming Soon)
- 🚧 Like/Dislike System (Coming Soon)
- 🚧 Comment Replies (Coming Soon)

## Project Structure

```
comment-system-backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Authentication controllers
│   ├── dal/
│   │   └── userDAL.js           # Data Access Layer for users
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT authentication middleware
│   │   └── validationMiddleware.js # Input validation
│   ├── models/
│   │   └── User.js              # User model
│   ├── routes/
│   │   └── authRoutes.js        # Authentication routes
│   ├── services/
│   │   └── authService.js       # Authentication business logic
│   ├── utils/
│   │   └── jwtUtils.js          # JWT utilities
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server entry point
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Installation

1. **Clone the repository**
   ```bash
   cd f:\techzu\comment-system-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy .env.example to .env
   copy .env.example .env
   
   # Edit .env and update the values
   ```

4. **Make sure MongoDB is running**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `.env` file

5. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/comment-system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Health Check
```http
GET /health
```

## Architecture

### Layered Architecture

1. **Routes Layer** (`src/routes/`)
   - Defines API endpoints
   - Applies middleware (validation, authentication)
   - Routes requests to controllers

2. **Controller Layer** (`src/controllers/`)
   - Handles HTTP requests and responses
   - Calls service layer for business logic
   - Returns formatted responses

3. **Service Layer** (`src/services/`)
   - Contains business logic
   - Validates data
   - Calls DAL for database operations

4. **Data Access Layer** (`src/dal/`)
   - Direct interaction with MongoDB
   - CRUD operations
   - Database queries

5. **Middleware Layer** (`src/middleware/`)
   - Authentication (JWT verification)
   - Input validation
   - Error handling

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Socket.io** - Real-time communication (ready for implementation)

## Next Steps

1. ✅ Authentication system complete
2. 🚧 Implement Comment model and CRUD operations
3. 🚧 Add like/dislike functionality
4. 🚧 Implement sorting and pagination
5. 🚧 Add reply functionality
6. 🚧 Set up WebSocket for real-time updates

## License

ISC
