# CareerVerse AI

**Discover Yourself. Design Your Future.**

An AI-powered career guidance app for school students, combining a
conversational AI mentor with a real psychometric assessment to produce a
personalized, ranked career match and roadmap.

Built for a National Level Hackathon on the problem statement: *"Develop an
easy-to-use tool that combines psychometric analysis and activity-based
assessments to provide personalized career guidance for school children."*

## What's fully working in this build

- **Auth** — signup / login with hashed passwords + JWT (FastAPI + SQLite)
- **AI Career Mentor chat** — real conversational flow; runs on a rule-based
  stub out of the box, and switches to a real LLM the moment you add one API
  key (see below) — no code changes needed
- **Psychometric assessment** — 18-question Likert assessment across six
  dimensions (Analytical, Creative, Social, Leadership, Technical, Hands-on)
- **Career Match Score** — real scoring engine (weighted cosine similarity
  between the student's trait profile and each career's ideal profile),
  visualized as radar + bar charts
- **Personalized Roadmap** — ordered, staged roadmap generated per matched
  career
- **Landing page, dashboard, and navigation** for the full experience

## What's stubbed (by design, for this pass)

Parent / Teacher / Admin dashboards, career simulations, multilingual
support, and gamification are represented as real routes with a clear
"mapped, not built yet" screen — the original spec's ~60 features were far
beyond a single build pass, so this pass focused on making the core loop
(mentor → assessment → match → roadmap) genuinely work end to end, on a real
stack, rather than mocking the whole surface area.

## Tech stack

- **Frontend:** React 18 + Vite, Tailwind CSS, Framer Motion, Chart.js,
  React Router
- **Backend:** FastAPI, SQLAlchemy + SQLite, JWT auth (python-jose + passlib)
- **AI:** provider-agnostic — Gemini / Groq / OpenRouter, swappable via one
  environment variable, with a rule-based fallback so the app works with
  zero API keys

## Running it locally

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API runs at `http://localhost:8000`. SQLite database (`careerverse.db`)
is created automatically on first run.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api` requests to the
backend automatically (see `vite.config.js`).

## Connecting a real AI provider

The mentor chat works out of the box with no key (rule-based stub). To turn
on a real LLM, set two environment variables before starting the backend —
no code changes needed:

```bash
# pick ONE provider
export AI_PROVIDER=groq
export GROQ_API_KEY=your_key_here

# or
export AI_PROVIDER=gemini
export GEMINI_API_KEY=your_key_here

# or
export AI_PROVIDER=openrouter
export OPENROUTER_API_KEY=your_key_here
```

All three have usable free tiers. If a call ever fails (bad key, wrong
model, rate limit), the backend logs the error to the console and falls
back to the stub reply so the chat never breaks mid-demo.

Each provider has a sensible default model baked in — override it with
`GROQ_MODEL` / `GEMINI_MODEL` / `OPENROUTER_MODEL` if you want a different
one. OpenRouter's free-model lineup changes over time, so if the default
stops working, check https://openrouter.ai/models?max_price=0 for a current
free model id.

## Security notes

- Passwords require 8+ characters with at least one letter and one number
  (`schemas.py`), and are hashed with bcrypt — never stored in plain text.
- Login and signup are rate-limited (10 requests/minute per IP) to blunt
  brute-force and scripted account creation.
- JWTs are signed with `CAREERVERSE_SECRET_KEY`. Without it set, the backend
  prints a loud warning and falls back to an insecure dev key — generate a
  real one before deploying anywhere:
  ```bash
  python -c "import secrets; print(secrets.token_hex(32))"
  export CAREERVERSE_SECRET_KEY=<the output>
  ```
- CORS is restricted to `ALLOWED_ORIGINS` (defaults to `localhost:5173` for
  local dev) — you'll set this to your real frontend URL when you deploy.

## Project structure

```
careerverse-ai/
├── backend/
│   ├── main.py                # FastAPI app entry point
│   ├── models.py               # SQLAlchemy models (User, AssessmentResult)
│   ├── schemas.py               # Pydantic request/response schemas
│   ├── security.py              # Password hashing + JWT
│   ├── deps.py                  # Auth dependency
│   ├── scoring.py                # Trait scoring + career match engine
│   ├── ai_service.py             # Provider-agnostic AI mentor logic
│   ├── data/
│   │   ├── questions.py          # Assessment question bank
│   │   └── careers.py            # Career catalog + roadmap templates
│   └── routers/
│       ├── auth.py
│       ├── assessment.py
│       ├── careers.py
│       ├── roadmap.py
│       └── mentor.py
└── frontend/
    └── src/
        ├── pages/                 # Landing, Login, Signup, Dashboard,
        │                           # Mentor, Assessment, CareerMatch,
        │                           # Roadmap, ComingSoon
        ├── components/             # Navbar, GlassCard, ConstellationHero,
        │                           # ProtectedRoute
        ├── AuthContext.jsx
        └── api.js
```

## Suggested next passes

1. Parent / Teacher / Admin dashboards, backed by role-based data views
2. "A Day in the Life" career simulations as interactive mini-scenarios
3. Multilingual mentor responses (the AI layer already supports a `lang`
   param — just needs UI + prompt wiring)
4. Gamification (XP, badges, streaks) — natural fit on top of the existing
   progress tracking in the dashboard
5. PDF export for assessment + roadmap results
