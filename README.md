# SyncDoc AI

SyncDoc is a privacy-first academic collaboration platform. Teams (students, study groups, or project collaborators) create shared workspaces to organize PDFs, images, links, code snippets, and tasks in one place — with member management and notifications to keep everyone in sync.

## Features

- **Authentication** — JWT-based signup/login with hashed passwords (bcrypt)
- **Workspaces** — create or join a workspace via a unique workspace code; each workspace has an owner and members
- **Shared content per workspace**
  - PDFs
  - Images
  - Links
  - Code snippets
- **Task management** — create tasks with status (`Pending` / `In Progress` / `Completed`), priority (`Low` / `Medium` / `High`), assignee, and due date
- **Members** — manage who belongs to a workspace
- **Notifications** — keep members updated on workspace activity
- **Search** — search within a workspace's content

## Tech Stack

**Client**
- React 18 + Vite
- React Router
- Axios

**Server**
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication, bcrypt password hashing
- Multer for file uploads

## Project Structure

```
syncdoc-ai/
├── client/               # React + Vite frontend
│   └── src/
│       ├── components/   # Navbar, Sidebar, Modal, WorkspaceCard
│       ├── context/      # AuthContext
│       ├── pages/        # Dashboard, Overview, Tasks, Links, Members, etc.
│       ├── routes/       # PrivateRoute
│       └── services/     # API clients (auth, workspace, task, content)
└── server/                # Express backend
    ├── config/           # DB connection
    ├── controllers/       # Route handlers
    ├── middleware/         # Auth, error handling
    ├── models/            # User, Workspace, Task, Pdf, Image, Link, Snippet, Notification
    ├── routes/            # REST API routes
    └── uploads/           # Uploaded file storage
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB (local instance or a connection URI)

### Server Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (see `.env.example`):

```
MONGO_URI=mongodb://127.0.0.1:27017/syncdoc-ai
PORT=5000
JWT_SECRET=replace_this_with_a_long_random_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Run the server:

```bash
npm run dev     # with nodemon
# or
npm start
```

The API will be available at `http://localhost:5000`, with a health check at `GET /api/health`.

### Client Setup

```bash
cd client
npm install
npm run dev
```

The client will be available at `http://localhost:5173`.

## API Overview

| Route | Description |
|---|---|
| `/api/auth` | Register / login |
| `/api/workspaces` | Create, list, and manage workspaces |
| `/api/notifications` | User notifications |
| `/api/workspaces/:workspaceId/pdfs` | PDF resources for a workspace |
| `/api/workspaces/:workspaceId/images` | Image resources for a workspace |
| `/api/workspaces/:workspaceId/links` | Shared links for a workspace |
| `/api/workspaces/:workspaceId/snippets` | Code snippets for a workspace |
| `/api/workspaces/:workspaceId/tasks` | Tasks for a workspace |
| `/api/workspaces/:workspaceId/members` | Workspace membership |
| `/api/workspaces/:workspaceId/search` | Search within a workspace |

## License

No license specified yet.
