# Data Science Interview Prep — Rapid Prototyping

13 iterations of building a **Data Science Interview Prep Guide** from scratch. Each version (`v01`–`v13`) is a self-contained HTML/CSS/JS prototype that builds on the last.

The root `index.html` is a gallery that shows all 13 versions side by side with live iframe previews.

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
| **v04** | Bloom — Light Pastel Theme | New mood — light pastel palette (rose, lavender, mint), garden metaphor, DM Serif Display headings, soft shadows, feminine aesthetic |
| **v05** | Duolingo-Style Path | Learning path with zigzag nodes, 3 lessons per topic, checkpoints, hearts, XP, chunky green buttons, continue where you left off |
| **v06** | Daily Challenge | Daily quiz format — one topic per day, countdown timer, calendar heatmap, streaks, timed 5-question challenges, tabbed study guide |
| **v07** | Textbook Edition | Traditional book — burgundy cover, serif font, parchment bg, 6 in-depth chapters with worked examples and analogies, practice exam appendix |
| **v08** | Interactive Kids Edition | Fun, interactive statistics for kids — hypothesis testing coin flips, confidence interval sliders, A/B testing buttons, CLT histograms. Bright colors, animations, simple explanations |
| **v09** | Professional Review | Interactive pro-level review for experienced DS professionals — advanced SQL, Python data science, probability theory, ML concepts. Clean interface, assessment quiz, focused content |
| **v10** | Spaced Repetition System | Intelligent flashcard system with spaced repetition algorithm — review scheduling, progress tracking, mastery analytics, study streaks, and detailed statistics dashboard |
| **v11** | Interactive Edition | Clean design combining the best interactive elements from previous versions — feature cards, demo buttons, modal explanations, focus on user engagement without visual clutter |
| **v12** | Animated Explanations | Transforms v11's interactive demos into educational animations showing step-by-step calculations and derivations that teach why concepts work. SQL join algorithms, confidence interval math, Bayes theorem walkthroughs, A/B test power analysis. Emphasis on "why it works" with mathematical foundations |
| **v13** | Deep Interactive | Combines textbook-depth explanations with live interactive sandboxes and comparison tables. Each topic features full theoretical breakdowns with analogies, side-by-side method comparisons, worked examples, and editable code editors with instant execution for hands-on learning |

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
