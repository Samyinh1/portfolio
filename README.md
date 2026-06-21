# myPortfolio

A full-stack portfolio for a software developer specializing in React.js, Generative AI, Node.js, Next.js, MongoDB, and delivery tools such as Jira and ClickUp.

## Tech Stack

- Frontend: React, Material UI, React Router, Axios, Framer Motion
- Backend: Node.js, Express.js, JWT, Multer, Nodemailer
- Database: MongoDB with Mongoose
- Deployment: Vercel for frontend, Render/Railway for backend, MongoDB Atlas for database

## Quick Start

```bash
cd myPortfolio
npm install
npm run install:all
```

Create environment files:

```bash
copy client\.env.example client\.env
copy server\.env.example server\.env
```

Run both apps:

```bash
npm run dev
```

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API health: http://localhost:5000/api/health

## Notes

- Seed portfolio data is returned automatically if MongoDB has no profile document yet.
- Use `POST /api/auth/login` with `ADMIN_EMAIL` and `ADMIN_PASSWORD` to receive a JWT.
- Authenticated users can update portfolio profile data and upload a resume.
