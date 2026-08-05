# Mandalink

Learn the building blocks of Mandarin — 214 radicals, flashcards, stroke order
practice, timed challenges, a leaderboard, and an AI tutor.

Rebuilt from the original Streamlit app into:
- **Frontend:** React (Vite)
- **Backend:** Java (Spring Boot)
- **Database:** PostgreSQL (Render)

## Project structure

```
mandalink-app/
├── backend/     Spring Boot REST API
└── frontend/    React (Vite) app
```

## Local development

### Backend

Requires Java 17+ and Maven.

```
cd backend
cp .env.example .env   # fill in values, or export them in your shell
mvn spring-boot:run
```

Without `DATABASE_URL` set, it falls back to a local H2 file database at
`backend/data/mandalink-dev` — good enough for development. Radicals load
automatically from `src/main/resources/data/radicals.csv` on first run.

Runs on `http://localhost:8080`.

### Frontend

Requires Node 18+.

```
cd frontend
cp .env.example .env
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## Deploying to Render

This deploys as two separate Render services plus a Render Postgres database,
all connected.

### 1. Push to GitHub

Create a repo and push this whole `mandalink-app/` folder to it.

### 2. Create a Postgres database on Render

Render dashboard → New → PostgreSQL. Once created, copy the **Internal
Database URL** (if backend and DB are in the same Render region) or
**External Database URL**.

### 3. Deploy the backend

Render dashboard → New → Web Service → connect your repo.
- **Root directory:** `backend`
- **Runtime:** Docker, or Native (Build command: `mvn clean package -DskipTests`,
  Start command: `java -jar target/mandalink-api-1.0.0.jar`)
- **Environment variables:**
  - `DATABASE_URL` → the Postgres URL from step 2
  - `FRONTEND_URL` → your frontend's Render URL (fill in after step 4, then redeploy)
  - `JWT_SECRET` → a random string (`openssl rand -hex 32`)
  - `GROQ_API_KEY` → your Groq API key
  - `GROQ_MODEL` → `llama-3.1-8b-instant` (or another Groq model)

### 4. Deploy the frontend

Render dashboard → New → Static Site → connect your repo.
- **Root directory:** `frontend`
- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`
- **Environment variables:**
  - `VITE_API_URL` → your backend's Render URL from step 3

### 5. Connect them

Once both are deployed, go back to the backend service's environment
variables and set `FRONTEND_URL` to the frontend's actual `.onrender.com`
URL, then trigger a redeploy so CORS allows requests from it.

## Migrating old user data

The original app stored users in Postgres already (see the old
`database.py`), with the same `users` table shape this backend uses
(`username`, `email`, `password_hash`, `xp`, `level`). If your old data
lives in the same Postgres database you connect here, it will just work —
no migration needed. If it's in a different database or a local file,
export it and insert it into the new `users` table before going live.
