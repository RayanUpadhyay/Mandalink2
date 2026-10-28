# Mandalink

**Learn the building blocks of Mandarin.** Live at **[mandalink.org](https://mandalink.org)**.

Mandalink teaches Chinese through its **214 Kangxi radicals**, the small components that keep appearing inside characters. Once you can spot them, unfamiliar characters stop looking like random strokes and start giving you clues. The app wraps that idea in flashcards, quizzes, timed challenges, stroke-order practice, an AI tutor, and enough XP, badges and leaderboards to keep you coming back.

> **Mandalink2 is a complete rewrite.** The first version, a single-file Python/Streamlit app, lives at **[MyChineseApp](https://github.com/RayanUpadhyay/MyChineseApp)**. It hit the limits of Streamlit (whole-script reruns on every click, no real URLs, styling through injected HTML, no API), so Mandalink was rebuilt from the ground up as a React frontend talking to a Spring Boot REST API.

## Features

**Learning**
- **Radicals:** browse and search all 214 radicals with pinyin and meaning, plus a radical of the day.
- **Flashcards**, **Quiz** and **Timed** challenge modes.
- **Stroke order:** animated, interactive stroke practice powered by [Hanzi Writer](https://hanziwriter.org/).
- **Pronunciation:** Mandarin audio through the browser's speech synthesis.
- **AI Help:** a radical tutor backed by the Groq API.
- **Worksheets:** search radicals, pick a set, choose how many practice boxes per character, and print a writing worksheet.
- **IB Chinese:** a course section following the IB B course's two themes and ten units (*Identities* and *Experiences*). Unit 1, 生活方式 *Lifestyle*, is built so far, with progress saved in the browser.

**Community and progress**
- Accounts with email/password or Google Sign-In, forgot-username and password-reset flows.
- XP, levels and a **leaderboard**.
- **Profiles** with bios, avatars and custom photo uploads (approved by an admin first), and clickable profiles for other learners.
- **Achievements and badges**, including a featured badge, timed badge drops, quest badges and a Hall of Fame.
- An **announcement board** that can also be embedded on other sites (it powers the news on [rayanupadhyay.com](https://rayanupadhyay.com)).
- Two visual themes (V1 and V2) with a theme switch.

**Admin**
- Dashboard with usage stats and page-view analytics, username/bio/avatar moderation, manual badge granting, badge-drop scheduling and announcement posting.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite 5, React Router 6, Hanzi Writer |
| Backend | Java 17, Spring Boot 3.3 (Web, Data JPA, Security, Validation), JJWT |
| Database | PostgreSQL in production, H2 file database for local dev |
| AI | Groq (`llama-3.1-8b-instant` by default) |
| Email | Resend (optional, for password resets) |
| Hosting | Render (Docker web service + static site + Postgres) |

## Project structure

```
Mandalink2/
├── backend/                 Spring Boot REST API
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/...         controllers, services, entities, repositories, security
│       └── resources/
│           ├── application.properties
│           └── data/radicals.csv
└── frontend/                React (Vite) app
    ├── public/              logos, announcements-embed.js
    └── src/
        ├── pages/           Home, Radicals, Flashcards, Quiz, Timed, Stroke, AiHelp,
        │                    Worksheet, Ib, Leaderboard, Profile, Announcements, Admin, ...
        ├── components/      Nav, badges, toasts, auth guard, announcement manager
        ├── ib/              IB course content
        ├── styles/          shared styles and the V1/V2 themes
        └── utils/           speech, badges, themes, image resizing
```

## Running locally

### Backend

Requires Java 17+ and Maven.

```bash
cd backend
cp .env.example .env    # fill in values, or export them in your shell
mvn spring-boot:run
```

Without `DATABASE_URL` the backend falls back to a local H2 file database at `backend/data/mandalink-dev`. Radicals load automatically from `src/main/resources/data/radicals.csv` on first run. The API listens on `http://localhost:8080`.

### Frontend

Requires Node 18+.

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Configuration

**Backend**

| Variable | Purpose |
|---|---|
| `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` | Postgres connection (H2 is used if unset) |
| `FRONTEND_URL` | Allowed CORS origin |
| `FRONTEND_BASE_URL` | Base URL used in emailed links (default `https://mandalink.org`) |
| `JWT_SECRET` | Token signing secret; generate with `openssl rand -hex 32` |
| `GROQ_API_KEY`, `GROQ_MODEL` | AI Help |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Password-reset emails (optional; without them the reset link is returned in the API response) |
| `GOOGLE_CLIENT_ID` | Google Sign-In |
| `PORT` | Server port (default 8080) |

**Frontend**

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend URL |
| `VITE_GOOGLE_CLIENT_ID` | Google Sign-In |

## Deploying to Render

1. **Database:** New → PostgreSQL. Copy the Internal Database URL (same region as the backend) or the External one.
2. **Backend:** New → Web Service, root directory `backend`, runtime Docker (or native with build `mvn clean package -DskipTests` and start `java -jar target/mandalink-api-1.0.0.jar`). Set the backend variables above.
3. **Frontend:** New → Static Site, root directory `frontend`, build `npm install && npm run build`, publish directory `dist`. Set `VITE_API_URL` to the backend URL.
4. **Connect them:** set the backend's `FRONTEND_URL` to the frontend's URL and redeploy so CORS allows it.

## Migrating from v1

The original app already stored users in Postgres with the same `users` shape (`username`, `email`, `password_hash`, `xp`, `level`), and both versions hash passwords with bcrypt. Point this backend at the same database and existing accounts carry over. If the old data lives elsewhere, export it into the new `users` table before going live.

## Author

Built by **Rayan Upadhyay** · [rayanupadhyay.com](https://rayanupadhyay.com)
