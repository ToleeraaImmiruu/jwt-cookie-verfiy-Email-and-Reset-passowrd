🔐 JWT Cookie Authentication System

A secure and scalable user authentication and authorization system built using Node.js, Express, JWT, and HTTP-only cookies. This project follows modern security best practices and is designed for full-stack integration with frontend frameworks like React (Vite + TypeScript).

🚀 Features

✅ User Registration (Signup)

✅ User Login & Logout

✅ JWT Authentication with Secure HTTP-Only Cookies

✅ Protected Routes (Authorization)

✅ Role-Based Access Control (RBAC)

✅ Password Hashing with Bcrypt

✅ Token Verification Middleware

✅ Auto Login via Cookie Session

✅ CORS Enabled for Frontend Integration

✅ Full-Stack Ready (Backend + Frontend)

✅ Clean & Scalable Folder Structure

🗂️ Project Structure
jwt-cookie-auth-system/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── config/
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   ├── App.tsx
│   └── main.tsx
│
├── .gitignore
└── README.md

⚙️ Tech Stack
🔹 Backend

Node.js

Express.js

MongoDB

JWT (JSON Web Token)

Bcrypt

Cookie-Parser

CORS

Dotenv

🔹 Frontend

React (Vite)

TypeScript

Axios

CSS

🔑 Authentication Flow

User registers with email & password

Password is securely hashed

JWT token is generated on login

Token is stored in HTTP-only Cookie

Protected routes verify the token

Logout clears the cookie

📦 Installation & Setup
✅ Clone the Repository
git clone https://github.com/ToleeraaImmiruu/jwt-cookie-auth-system.git
cd jwt-cookie-auth-system

✅ Backend Setup
cd backend
npm install


Create a .env file in backend/:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key


Run backend server:

npm run dev

✅ Frontend Setup
cd frontend
npm install
npm run dev

🔐 Example API Endpoints

Method	Endpoint	Description
POST	/api/register	Register user
POST	/api/login	Login user
POST	/api/logout	Logout user
GET	/api/me	Get current user

🛡️ Security Features

HTTP-only cookies prevent XSS attacks

Encrypted passwords using bcrypt

JWT token validation middleware

Environment variable protection

CORS configured for frontend access

👨‍💻 Author

Tolera Imiru
📍 Ethiopia
💻 Full-Stack Developer (MERN Stack)

⭐ Contribute

Contributions are welcome!

Fork the project

Create your branch

Commit changes

Push to your branch

Open a Pull Request
