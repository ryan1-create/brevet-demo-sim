# Brevet Sales Simulation — Demo

A client-agnostic demo of the Brevet Sales Simulation. Built for Brevet's business development team to show prospects what a premium, AI-coached sales exercise feels like. Based on the methodology of Business Value Selling.

## What it does

A prospect arrives at the welcome screen, picks their industry (Technology, Financial Services, Professional Services, or Healthcare), names their team, and is dropped into a realistic sales scenario. They work through Brevet's four-part Legacy Displacement framework (Value Gaps, Art of the Possible, Impact, Customer Story), submit their thinking, and receive live AI coaching from Claude grounded in Brevet's methodology.

## Tech stack

- Next.js 14 (App Router)
- React 18
- Anthropic Claude API (Sonnet 4)
- Deployed on Vercel

No database. No state persistence. This is a single-session demo tool — each run is self-contained.

## Local development

```bash
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key for the scoring endpoint |

## Deploying to Vercel + GitHub

Full step-by-step deployment guide — run these commands from inside the `brevet-demo-sim/` directory.

### 1. Initialize git

```bash
git init
git add .
git commit -m "Initial commit: Brevet Sales Simulation demo"
```

### 2. Create a GitHub repo

Go to [https://github.com/new](https://github.com/new) and create a new **private** repository named `brevet-demo-sim`. Don't initialize it with a README — we already have one.

Back in your terminal:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/brevet-demo-sim.git
git push -u origin main
```

### 3. Deploy to Vercel

**Option A — Via the Vercel dashboard (recommended for first deploy):**

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**, select your `brevet-demo-sim` repo
3. Framework preset should auto-detect as **Next.js**
4. Under **Environment Variables**, add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))
5. Click **Deploy**

First deploy takes about 60 seconds. Vercel will give you a URL like `brevet-demo-sim.vercel.app`. You can set a custom domain later in Vercel settings.

**Option B — Via the Vercel CLI:**

```bash
npm i -g vercel
vercel login
vercel
# Follow prompts. When asked to set env vars, paste your ANTHROPIC_API_KEY.
vercel --prod
```

### 4. Set up auto-deploys

Vercel watches the `main` branch by default. Every push triggers a new production deploy. Branch pushes get preview URLs.

```bash
# Edit something, then:
git add .
git commit -m "Your change description"
git push
# Deploy happens automatically
```

## Project structure

```
brevet-demo-sim/
├── app/
│   ├── layout.js           Root layout, metadata
│   ├── page.js             State machine for the whole flow
│   ├── globals.css         Design tokens, fonts
│   └── api/
│       └── score/
│           └── route.js    Claude scoring endpoint
├── components/
│   ├── NavBar.jsx          Persistent top nav with leaderboard drawer
│   ├── Welcome.jsx         Dark-theme entry screen
│   ├── ScenarioBrief.jsx   Light-theme brief with iridescent persona cards
│   ├── ChallengeCanvas.jsx Framework-filling workspace
│   └── ScoringReveal.jsx   Dark-theme scoring takeover
├── lib/
│   ├── scenarios.js        All scenario content + motion data
│   └── mockLeaderboard.js  Fake leaderboard for demo
├── package.json
├── next.config.js
├── vercel.json
└── README.md
```

## The scenario model

Every scenario is a combination of:
- **Industry** (Technology, Financial Services, Professional Services, Healthcare)
- **Motion** (Legacy Displacement — R1, Replacement — R2, Defense — R3, Expansion — R4)

Scenarios live in `lib/scenarios.js`. Round 1 (Legacy Displacement) is fully built out across all four industries. Rounds 2–4 are stubbed with the right data shape but have empty framework cards and scoring criteria — these need to be filled in for a full four-round experience.

To add a new industry or new round, follow the existing shape in `lib/scenarios.js`. Everything else (UI, scoring, nav) is data-driven.

## Roadmap (what's not yet shipped)

- Rounds 2, 3, and 4 scenarios + framework specs + scoring rubrics
- Custom Brevet logo loader animation (replacing the generic spinner)
- The "wobble" curveball phase after initial scoring
- Round-to-round transitions
- Final verdict / certificate screen
- Brand asset swap-in (real Brevet logo SVG)

## Credit

Built with Claude Code and Claude Design as the design partners. Design system, scenario data, and scoring methodology all authored for Brevet's specific use case.
