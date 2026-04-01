# Data Science Interview Prep — Rapid Prototyping

25 iterations of building a **Data Science Interview Prep Guide** from scratch. Each version (`v01`–`v25`) is a self-contained HTML/CSS/JS prototype across four phases: explore wide, converge the best ideas, try targeted features, then fine-tune to production.

The root `index.html` is a gallery that shows all versions side by side with live iframe previews.

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

### Phase 1: Go Wide (v01–v12)

Explore radically different designs — cast a wide net to discover what works.

| Version | Name | What Changed |
|---------|------|-------------|
| **v01** | Bare Bones | Single scrolling page covering all 6 topics with cheat sheet cards, sample quiz questions, and minimal content |
| **v02** | Multi-Page Layout | Reorganized into separate pages — home with topic buttons, dedicated pages for each topic + quiz, top nav bar |
| **v03** | RPG Gamified Layout | RPG theme with XP bars, skill dungeons, loot-rarity concept cards, daily quests, battle-mode quiz with hearts/streaks |
| **v04** | Bloom — Light Pastel Theme | Light pastel palette (rose, lavender, mint), garden metaphor, DM Serif Display headings, soft shadows |
| **v05** | Duolingo-Style Path | Learning path with zigzag nodes, 3 lessons per topic, checkpoints, hearts, XP, chunky green buttons |
| **v06** | Daily Challenge | One topic per day, countdown timer, calendar heatmap, streaks, timed 5-question challenges, tabbed study guide |
| **v07** | Textbook Edition | Traditional book — burgundy cover, serif font, parchment bg, 6 in-depth chapters with worked examples |
| **v08** | Interactive Kids Edition | Fun interactive statistics — coin flips, confidence interval sliders, A/B testing buttons, CLT histograms |
| **v09** | Professional Review | Pro-level review — advanced content, clean interface, assessment quiz |
| **v10** | Spaced Repetition System | Flashcard system with spaced repetition algorithm, mastery analytics, study streaks |
| **v11** | Interactive Edition | Clean design combining best interactive elements — feature cards, demo buttons, modal explanations |
| **v12** | Animated Explanations | Step-by-step calculation animations — SQL join algorithms, confidence interval math, Bayes walkthroughs |

### Phase 2: Converge (v13–v15)

Combine and mix-match the strongest ideas from exploration into cohesive experiences.

| Version | Name | What Changed |
|---------|------|-------------|
| **v13** | Deep Interactive | Textbook-depth explanations + live interactive sandboxes + comparison tables. Editable code editors with instant execution |
| **v14** | Bright Practice | Bright light theme with color-coded topics. Every section links to curated StrataScratch and LeetCode problems |
| **v15** | Quest Mode | Gamified RPG mashup of v03+v05+v06+v08 — dungeons, XP, hearts, daily challenges, battle quiz, interactive demos |

### Phase 3: Narrow Down (v16–v21)

Test meaningful features on a v13+v14 hybrid base — interactive sandboxes meet practice links.

| Version | Name | What Changed |
|---------|------|-------------|
| **v16** | Story Mode | Narrative learning through real company scenarios (Spotify DAU drop, Uber pricing). Dark/light toggle for long sessions |
| **v17** | Coding Playground | Live SQL/Python editors with stopwatch timer and pre-loaded challenge problems with expected output |
| **v18** | Mock Interview | Conversational interview simulation with follow-up questions, model answers, and before/after answer reveals |
| **v19** | Company Playbook | Company-specific patterns (Meta, Google, Amazon) with real interview focus areas. Cmd+K global search |
| **v20** | Quick Reference | Condensed single-screen cheat sheets with learn/review toggle and print-friendly output |
| **v21** | Weak Spot Tracker | Diagnostic quiz identifying gaps, personalized focus zones, and progress rings per sub-topic |

### Phase 4: Fine-Tune (v22–v25)

Polish and harden — ship it.

| Version | Name | What Changed |
|---------|------|-------------|
| **v22** | Bookmarks & Notes | Star weak spots, jot sticky notes, build a custom review list saved to localStorage |
| **v23** | Accessibility Pass | ARIA labels, keyboard navigation, focus rings, WCAG contrast fixes |
| **v24** | Content QA | All content reviewed for accuracy, code examples tested, links verified |
| **v25** | Launch Ready | Meta tags, Open Graph image, favicon, final visual polish. Ship it |

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
