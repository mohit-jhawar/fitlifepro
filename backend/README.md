# FitLife Pro Backend

Backend API server for FitLife Pro fitness application.

## Features

- ✅ User authentication (JWT)
- ✅ User registration and login
- ✅ Password reset functionality
- ✅ Email verification
- ✅ Profile management
- ✅ Secure password hashing (bcrypt)
- ✅ Token refresh mechanism
- ✅ Rate limiting
- ✅ Input validation
- ✅ CORS protection

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fitlife_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

4. Create PostgreSQL database:
```bash
createdb fitlife_db
```

5. Run database setup:
```bash
npm run db:setup
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password | No |
| POST | `/api/auth/verify-email` | Verify email | No |
| DELETE | `/api/auth/account` | Delete account | Yes |

### Example Requests

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "name": "John Doe",
    "gender": "male"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

**Get Current User:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── authController.js    # Authentication logic
├── database/
│   ├── schema.sql           # Database schema
│   └── setup.js             # Database setup script
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── validators.js        # Input validation
├── models/
│   ├── User.js              # User model
│   └── RefreshToken.js      # Refresh token model
├── routes/
│   └── auth.js              # Authentication routes
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore file
├── package.json             # Dependencies
└── server.js                # Main server file
```

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication
- Refresh token mechanism
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- CORS protection
- Helmet security headers
- SQL injection prevention

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | fitlife_db |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration | 7d |
| JWT_REFRESH_SECRET | Refresh token secret | - |
| JWT_REFRESH_EXPIRE | Refresh token expiration | 30d |
| FRONTEND_URL | Frontend URL | http://localhost:3000 |

## License

MIT
