# Claudea's DS Interview Prep — Rapid Prototyping

25 iterations of building a **Data Science Interview Prep Guide** from scratch. Each version (`v01`–`v25`) is a self-contained HTML/CSS/JS prototype that builds on the last.

The root `index.html` is a gallery that shows all 25 versions side by side with live iframe previews.

## The Product

A single-page study tool for data science interviews covering six topics:

- **SQL** — query syntax, joins, window functions, CTEs, optimization
- **Python** — data structures, Pandas, NumPy, coding patterns
- **Machine Learning** — algorithms, metrics, bias-variance, feature engineering
- **Statistics** — hypothesis testing, confidence intervals, A/B testing, CLT
- **Probability** — Bayes' theorem, distributions, expected value, classic puzzles
- **Case Studies** — product metrics, frameworks, metric debugging, experiment design

Each topic gets a **cheat sheet** reference section and there is a **quiz** section with questions across all topics.

## Version Progression

| Version | Name | What Changed |
|---------|------|-------------|
| **v01** | Bare Bones | Single scrolling page covering all 6 topics (SQL, Python, ML, Stats, Probability, Casing) with cheat sheet cards, sample quiz questions, and minimal content |
| **v02** | Multi-Page Layout | Reorganized into separate pages — home with topic buttons (Strata-style), dedicated pages for each topic + quiz, top nav bar linking to all subpages |
| **v03** | RPG Gamified Layout | Entirely new design — RPG theme with XP bars, skill dungeons, loot-rarity concept cards, daily quests, battle-mode quiz with hearts/streaks |
| v04 | Hero Section | Full-width hero with title, topic pills, intro copy |
| v05 | SQL Content | Real SQL cheat sheet — query order, JOINs, window functions, CTEs |
| v06 | Python Content | Real Python cheat sheet — data structures, Pandas, NumPy, patterns |
| v07 | ML Content | Real ML cheat sheet — algorithms, metrics, bias-variance, features |
| v08 | Statistics Content | Real Stats cheat sheet — hypothesis testing, CIs, A/B testing, CLT |
| v09 | Probability Content | Real Probability cheat sheet — Bayes, distributions, expected value |
| v10 | Case Studies Content | Real Casing cheat sheet — product metrics, frameworks, debugging |
| v11 | Quiz Build-Out | 25+ real questions with explanations and difficulty tags |
| v12 | Responsive Layout | Mobile-first breakpoints, stacking cards, collapsing nav |
| v13 | Sidebar Navigation | Fixed sidebar on desktop, hamburger menu on mobile |
| v14 | Progress Tracking | Checkboxes, localStorage persistence, progress bar |
| v15 | Search & Filter | Global search across topics, concepts, and quiz |
| v16 | Quiz Timer Mode | Countdown timer, speed-based scoring |
| v17 | Tip & Warning Callouts | Interview tips, common mistakes, gotcha boxes |
| v18 | Print-Friendly Cheat Sheets | Print stylesheet for clean output |
| v19 | Dark/Light Toggle | Theme toggle with preference persistence |
| v20 | Scroll Animations | Intersection Observer fade-in and slide-up effects |
| v21 | Spaced Repetition | Missed quiz questions resurface more often |
| v22 | Bookmarks & Notes | User bookmarks and notes saved to localStorage |
| v23 | Accessibility Pass | ARIA labels, keyboard nav, focus rings, contrast fixes |
| v24 | Content QA | Accuracy review, code tested, links verified |
| v25 | Launch Ready | Meta tags, OG image, favicon, production-ready |

## Structure

```
rapid-prototyping/
├── index.html          ← gallery showing all 25 versions
├── README.md
├── v01/index.html      ← Bare Bones (current)
├── v02/index.html      ← (planned)
├── ...
└── v25/index.html      ← (planned)
```

## Running Locally

Open `index.html` in a browser, or:

```bash
npx serve .
```
