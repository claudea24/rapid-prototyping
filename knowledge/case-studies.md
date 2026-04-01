# Case Studies — Thinking Like a Data Scientist

Case studies test whether you can apply data science concepts to real business problems. The technical knowledge from previous chapters is necessary but not sufficient — you must also demonstrate structured thinking, clear communication, and business judgment. This chapter provides the frameworks and worked examples to do exactly that.

---

## 6.1 Product Metrics (AARRR Framework)

The "pirate metrics" framework captures the user lifecycle in five stages. Understanding it lets you quickly identify which part of the funnel is broken when a metric changes.

**Acquisition** — How users discover your product. Example metrics: new sign-ups per week, cost per acquisition (CPA), organic vs. paid split, channel-specific conversion rates. You can't grow without awareness; track by channel to allocate spend toward high-value sources.

**Activation** — When a user first experiences your product's core value. Example metrics: % completing onboarding, time to first key action ("aha moment"), onboarding funnel completion rate. Activation is the bridge between acquisition and retention — improving it multiplies the value of every acquired user.

**Retention** — Do users come back? Example metrics: Day-1, Day-7, Day-30 retention rates, weekly/monthly active users (WAU/MAU), cohort retention curves, churn rate. This is the most important stage. Strong retention compounds; poor retention means you're perpetually filling a leaky bucket.

**Revenue** — How the product makes money. Example metrics: ARPU (average revenue per user), LTV (lifetime value), free-to-paid conversion rate, MRR (monthly recurring revenue), LTV-to-CAC ratio. Revenue validates the business model and distinguishes high-value from low-value user cohorts.

**Referral** — Do users bring other users? Example metrics: NPS (Net Promoter Score), viral coefficient (invites sent × conversion per invite), percentage of new users arriving via referral. Referral is a proxy for genuine satisfaction and provides nearly free acquisition with pre-qualified users.

| Stage | Definition | Example Metrics | Why It Matters |
|-------|-----------|----------------|----------------|
| **Acquisition** | How users discover product | Sign-ups, CPA, channel split | Can't grow without awareness |
| **Activation** | First core value experience | Onboarding %, time to first action | Multiplies acquisition value |
| **Retention** | Do users come back? | D1/D7/D30, churn, cohort curves | Most important; compounds |
| **Revenue** | How product makes money | ARPU, LTV, conversion, MRR | Validates business model |
| **Referral** | Do users bring others? | NPS, viral coefficient | Free, pre-qualified acquisition |

### The North Star Metric

A North Star Metric is a single number that captures the core value your product delivers to users. It sits at the intersection of user satisfaction and business sustainability. If it grows, both users and the business are winning.

| Company | North Star Metric | Why It Works |
|---------|------------------|-------------|
| Airbnb | Nights booked | Captures value for both guests and hosts |
| Spotify | Time spent listening | Engagement proxy for satisfaction |
| Facebook | Daily active users | Habitual use prerequisite for monetization |

> **Key Insight:** A good North Star aligns user value with business value. If it grows while users are unhappy or the business is losing money, it's the wrong metric. The best North Stars make user success and business success the same thing.

---

## 6.2 Structuring Your Approach

The six-step framework gives you a repeatable structure for any case question:

1. **Clarify** — Restate the problem back. Ask scope questions: which product? which platform? which user segment? what time window? global or regional? This shows rigor, not weakness.

2. **Define Metrics** — Identify a primary metric (directly measures the problem) and one or two guardrail metrics (prevent unintended harm elsewhere). Example: engagement as primary, revenue per user as guardrail (ensure you're not giving the product away for free).

3. **Hypothesize** — State your leading hypotheses *before* touching data. This frames the analysis and shows you think before you compute.

4. **Analyze** — Segment along relevant dimensions: cohort, platform, geography, time, feature, traffic source. Move from "something changed" to "this specific thing changed for this specific group."

5. **Recommend** — Translate findings into a concrete action paired with an expected impact estimate. "I recommend X, which I estimate would recover Y percentage points."

6. **Measure** — Close the loop: how will you validate your recommendation? What experiment will you run? Which metric? What time horizon?

### Example 6.1 — "WAU Dropped 15% Last Week"

**Clarify:** Is this 15% week-over-week? All platforms or specific? Compared to the prior week or the same week last year?

**Define Metrics:** Primary = WAU. Guardrails = revenue per user, session quality (pages/session, time/session).

**Hypothesize:** (a) Product bug preventing access on certain devices. (b) Seasonal or external event (holiday, competitor launch). (c) Marketing campaign ended, reducing new user inflow.

**Analyze:** Segment by platform → drop is almost entirely iOS. Segment by app version → concentrated in v4.7. Check crash logs → spike in crashes after recent deploy.

**Recommend:** "The drop is caused by an iOS v4.7 crash bug. I recommend an immediate hotfix plus a re-engagement push notification to affected users. I estimate this recovers ~12 of the 15 lost points within one week."

**Measure:** Track iOS WAU recovery daily. Monitor crash rates and App Store ratings as leading indicators.

---

## 6.3 Diagnosing Metric Changes

### Investigation Framework

1. **Is it a data problem?** Check the logging pipeline. Did a schema migration break the tracking? Is there a data processing delay? Data problems are embarrassingly common — rule them out first.

2. **Is it an external factor?** Holidays, competitor launches, news events, app-store algorithm changes, weather. A ridesharing company sees a spike during a transit strike; a food delivery app dips during nice weather.

3. **Is it an internal change?** Check the changelog: new feature release? UI redesign? pricing change? experiment ramped to 100%? This is the most actionable category — you can reverse or modify internal changes.

4. **Segment to isolate.** Drill down by platform, geography, user cohort, device type, subscription tier. Move from "revenue went up" to "revenue went up among Premium users in North America on iOS."

5. **Quantify the contribution.** How much of the overall movement does the identified driver explain? If it explains 90% of the change, you've found the primary driver. If only 20%, keep looking.

### Example 6.2 — "Revenue Up 20% but Rides Down 5%"

**Decomposition:**

```
Revenue = Rides × Revenue per Ride
1.20 = 0.95 × X
X ≈ 1.263 → Revenue per ride up ~26%
```

**Hypotheses:**

- **Price increase:** Did the company raise base fares or implement more aggressive surge pricing?
- **Mix shift:** Fewer short commutes but steady long/airport rides → higher average fare.
- **Product mix:** Launch of premium tier (Black/XL) → larger share of expensive rides.

**Next steps:** Segment by ride type, geography, time of day. If 80% of the revenue increase comes from a new surge pricing algorithm, that's the answer — but also flags risk of aggressive pricing driving volume down further.

---

## 6.4 Market Sizing

### Two Primary Approaches

**Top-Down:** Start with a large known number (population, total market revenue) and narrow through successive filters. Fast; works when macro data is reliable. Structure: TAM → segment → penetration → target metric.

**Bottom-Up:** Start with a single unit (one store, one user, one transaction) and scale up. More grounded — each assumption is about a concrete thing you can sanity-check. Structure: unit economics → units per location → number of locations → total.

| Approach | Start With | Structure | Strength |
|----------|-----------|-----------|----------|
| **Top-Down** | Large known number | TAM → filter → target | Fast, macro-level |
| **Bottom-Up** | Single unit | Unit economics → scale | More grounded, concrete |

### Example 6.3 — How Many Piano Tuners in Chicago?

**Step 1 — Pianos in Chicago:**
- Chicago metro population: ~9.5 million → ~3.5 million households
- Estimate ~5% own a piano = 175,000 household pianos
- Add institutions (schools, churches, concert halls, studios): ~10,000
- **Total: ~185,000 pianos**

**Step 2 — Tunings per year:**
- A well-maintained piano: 1–2 tunings per year; average 1
- **Total: ~185,000 tunings per year**

**Step 3 — Tunings per tuner per year:**
- A tuning takes ~2 hours including travel
- A tuner works 8 hours/day × 5 days/week × 50 weeks/year = 2,000 hours/year
- 2,000 hours / 2 hours per tuning = **1,000 tunings per tuner per year**

**Step 4 — Divide:**
- 185,000 / 1,000 = **~185 piano tuners**
- Actual estimate: 100–300. Our answer is comfortably in range.

> **Key Insight:** Interviewers care about structure and assumptions, not the exact number. A clearly reasoned estimate off by a factor of 2 is infinitely better than a lucky guess with no justification. State assumptions explicitly, flag your confidence level, and note which assumptions the answer is most sensitive to.

---

## 6.5 Experiment Design

| Decision | Options | Default | Watch Out |
|----------|---------|---------|-----------|
| **Randomization unit** | User, session, page | User-level | Network effects → use cluster randomization |
| **Duration** | Days to weeks | ≥ 1 full weekly cycle | Day-of-week effects, pay cycles |
| **Guardrail metrics** | AOV, support tickets, returns, load time | Always include several | Must not degrade even if primary improves |
| **Network effects** | Standard vs. cluster | Standard (if independent) | Social/marketplace products → cluster |
| **Novelty/primacy** | Short vs. long test | Run 2–4 weeks | Initial lift may fade; initial resistance may resolve |

**Unit of randomization:** User-level is the default — each user is assigned to treatment or control for the entire experiment. Session-level randomization means a user might see different versions across visits, which can confuse analysis. Page-level is rarely appropriate.

**Duration and sample size** depend on: baseline metric value, minimum detectable effect (MDE), significance level α (0.05), and desired power (0.80). Calculate required sample size → divide by daily traffic → that's your duration. Always run at least one full weekly cycle (7+ days) to capture day-of-week effects.

**Guardrail metrics** protect against unintended harm. Even if your primary metric improves, you need to confirm you haven't degraded user experience elsewhere.

**Network effects** break the independence assumption in standard A/B tests. In social products, marketplaces, or messaging platforms, one user's treatment can affect another user's outcome. Solution: cluster randomization — randomize at the region, community, or market level.

**Novelty and primacy effects:** Novelty means users engage more because something is new (lift fades). Primacy means long-time users initially react negatively to change (dip recovers). Remedy: run long enough (2–4 weeks) and analyze treatment effect over time for stabilization.

### Example 6.4 — Testing New Checkout Flow (4 → 2 Steps)

**Unit:** User-level (consistent experience across sessions)

**Primary metric:** Checkout completion rate (users reaching payment confirmation after adding an item)

**Guardrail metrics:**
1. Average order value (ensure streamlined flow doesn't cause users to skip adding items)
2. 14-day return rate (ensure speed doesn't lead to accidental purchases)
3. Support contacts related to checkout (ensure not confusing)

**Sample size:** Current completion 65%, want to detect a 2-point lift (→ 67%), α = 0.05, power = 0.80. Required: ~4,400 per arm = 8,800 total. At 2,000 checkout users/day = ~5 days needed. **Round up to 14 days** (two full weekly cycles + time for novelty to fade).

**Analysis plan:** After 14 days, two-proportion z-test. Check all guardrails for degradation. Plot treatment effect by day to verify stabilization. If primary metric is significant and guardrails are OK, recommend full rollout.

---

## 6.6 Communicating Your Analysis

**Lead with the answer (Pyramid Principle).** State the conclusion first, then the supporting evidence. "The drop was caused by an iOS v4.7 bug crashing on older devices. Here's how I found that." This is the opposite of natural storytelling, but far more effective in business contexts where executives want the bottom line immediately.

**Signal your structure.** Tell the interviewer where you're going: "I'll approach this in three parts: clarify the metric, investigate potential causes, then recommend an action." Sign-posting makes you dramatically easier to follow.

**Quantify everything.** Avoid vague language. Not "affected a lot of users" but "affected approximately 120,000 users, roughly 8% of MAU." Even estimates are better with numbers: "roughly 120K ± 20%."

**Acknowledge trade-offs.** No recommendation comes without costs. Proactively name them: "Rolling out the hotfix recovers engagement but delays the redesign by 2 sprints. The alternative — a targeted fix for just the crash — is lower risk but recovers less." Naming trade-offs strengthens, not weakens, your credibility.

**Ask clarifying questions.** This goes beyond getting the right answer — it shows intellectual maturity. Real-world problems are inherently ambiguous. "When you say engagement, do you mean DAU, time spent, or actions per session?" demonstrates that you've worked with these concepts in practice.

> **Key Insight:** The best technical answer, poorly communicated, loses to a decent answer well communicated. Analysis only creates value if someone understands it well enough to act on it. Practice communication with the same discipline as technical preparation.
