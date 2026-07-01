# myPortfolio

A full-stack portfolio for a software developer specializing in React.js, Generative AI, Node.js, Next.js, MongoDB, and delivery tools such as Jira and ClickUp.

## Tech Stack

- Frontend: React, Material UI, React Router, Axios, Framer Motion
- Backend: Node.js, Express.js, JWT, Multer, Nodemailer
- Database: MongoDB with Mongoose
- Deployment: Vercel (frontend), Railway (backend), MongoDB Atlas (database)

---

## Architecture: Monorepo with Split Deployments

The client and server live in a **single Git repository**, pushed together — but the deployment pipeline treats them as **independent services**.

### Repository Structure

```
myPortfolio/
├── client/       # React + Material UI frontend
└── server/       # Node.js + Express + MongoDB backend
```

Both `client/` and `server/` are co-located, versioned, and reviewed together. A single `git push` to `main` is all it takes to trigger deployments for both services simultaneously — no manual handoff, no separate repositories.

### How the Split Deployment Works

**Client → Vercel**
- Vercel watches the `client/` subtree of the repository.
- On every push to `main`, it automatically detects changes, builds the React app, and deploys it to a global CDN.
- Zero-config setup — Vercel handles the build command (`npm run build`) and output directory automatically.

**Server → Railway**
- Railway watches the `server/` subtree of the repository.
- On the same push, it provisions the Node/Express service and connects it to a managed MongoDB Atlas instance.
- Auto-deploys in parallel with the Vercel build, keeping frontend and backend releases in sync.

### Environment Isolation

Secrets and environment-specific config are injected per platform and never committed to source control:

| Variable | Platform |
|---|---|
| `VITE_API_URL` | Vercel environment variables |
| `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Railway environment variables |

### Deployment Flow Summary

```
git push origin main
       │
       ├──► Vercel detects client/ changes
       │         └──► Build React app → Deploy to CDN
       │
       └──► Railway detects server/ changes
                 └──► Build Node/Express app → Deploy to Railway instance
                           └──► Connects to MongoDB Atlas
```

---

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

## Local URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API health: http://localhost:5000/api/health

## Notes

- Seed portfolio data is returned automatically if MongoDB has no profile document yet.
- Use `POST /api/auth/login` with `ADMIN_EMAIL` and `ADMIN_PASSWORD` to receive a JWT.
- Authenticated users can update portfolio profile data and upload a resume.
