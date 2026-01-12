

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - Logout (protected)
- `POST /api/auth/logout-all` - Logout all devices (protected)

### Comments
- `POST /api/comments` - Create root comment (protected)
- `POST /api/comments/:id/reply` - Reply to comment (protected)
- `GET /api/comments` - Get root comments with pagination & sorting (public)
- `GET /api/comments/:id/replies` - Get replies with pagination (public)
- `PUT /api/comments/:id` - Update comment (protected, owner only)
- `DELETE /api/comments/:id` - Delete comment (protected, owner only)
- `POST /api/comments/:id/like` - Like/unlike comment (protected)
- `POST /api/comments/:id/dislike` - Dislike/undislike comment (protected)

## Pagination Implementation

**Query Parameters:**
```
GET /api/comments?page=1&limit=20&sortBy=newest
```

**Response:**
```json
{
  "success": true,
  "data": {
    "comments": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

## Sorting Options

1. **newest** - Most recent first (default for root comments)
2. **oldest** - Oldest first (default for replies)
3. **most_liked** - Highest like count first
4. **most_disliked** - Highest dislike count first

## Real-time Events (Socket.io)

- `comment:created` - New comment created
- `comment:reply_created` - New reply added
- `comment:updated` - Comment edited
- `comment:deleted` - Comment deleted
- `comment:like_updated` - Like/unlike action
- `comment:dislike_updated` - Dislike/undislike action

## Security Features

✅ **Authentication**
- JWT access tokens (short-lived: 15 minutes)
- Refresh tokens in httpOnly cookies (7 days)
- Socket.io connections require JWT authentication

✅ **Authorization**
- Ownership validation for edit/delete operations
- Protected routes for all write operations
- Optional authentication for read operations (for hasLiked/hasDisliked)

✅ **Validation**
- Input validation (1-2000 characters)
- Email and username format validation
- Password strength requirements (min 6 chars)
- Duplicate prevention for likes/dislikes

✅ **Data Integrity**
- Soft delete for comments
- Mutually exclusive like/dislike
- Parent comment validation for replies
- MongoDB indexes for performance

## Architecture

**Modular Layered Architecture:**
```
Routes → Controllers → Services → DAL → Models
```

- **Routes**: Endpoint definitions with middleware
- **Controllers**: HTTP request/response handling
- **Services**: Business logic and validation
- **DAL**: Database operations
- **Models**: Mongoose schemas
- **Middleware**: Authentication, validation, authorization
- **Socket**: Real-time event handling



## Production Ready

✅ Error handling
✅ Input validation
✅ Security best practices
✅ Real-time updates
✅ Scalable architecture
✅ Professional code structure
✅ Comprehensive documentation

---


