// search.js — Global search with Cmd+K for v22 Story + Company
(function() {
  const INDEX = [
    // SQL
    { title: "Query Execution Order", section: "1.1", topic: "SQL", icon: "\u{1F4C2}", url: "sql.html#scene1", companies: ["meta","google","amazon"], keywords: "select from where group by having order limit alias execution instagram search warehouse" },
    { title: "Joining Tables", section: "1.2", topic: "SQL", icon: "\u{1F4C2}", url: "sql.html#scene1", companies: ["meta","google","amazon"], keywords: "inner left right full outer cross join self-join" },
    { title: "Window Functions", section: "1.3", topic: "SQL", icon: "\u{1F4C2}", url: "sql.html#scene2", companies: ["meta","google","amazon"], keywords: "row_number rank dense_rank partition over lag lead running total" },
    { title: "Aggregation & Grouping", section: "1.4", topic: "SQL", icon: "\u{1F4C2}", url: "sql.html#scene2", companies: ["meta","google","amazon"], keywords: "group by having count sum avg null where vs having" },
    { title: "CTEs & Optimization", section: "1.5", topic: "SQL", icon: "\u{1F4C2}", url: "sql.html#scene3", companies: ["meta","google","amazon"], keywords: "common table expression with recursive cte explain index optimization" },
    { title: "Query Performance", section: "1.6", topic: "SQL", icon: "\u{1F4C2}", url: "sql.html#scene3", companies: ["meta","google","amazon"], keywords: "explain index select star filter early exists performance" },

    // Python
    { title: "Data Structures & Complexity", section: "2.1", topic: "Python", icon: "\u{1F40D}", url: "python.html#scene1", companies: ["meta","google","amazon"], keywords: "list dict set deque heap hash map complexity O(n) feed mapreduce pipeline" },
    { title: "Pandas for Data Manipulation", section: "2.2", topic: "Python", icon: "\u{1F40D}", url: "python.html#scene1", companies: ["meta","google","amazon"], keywords: "dataframe groupby merge pivot table pandas agg" },
    { title: "Common Coding Patterns", section: "2.3", topic: "Python", icon: "\u{1F40D}", url: "python.html#scene2", companies: ["meta","google","amazon"], keywords: "two pointer sliding window hash map two sum greedy" },
    { title: "Python Gotchas", section: "2.4", topic: "Python", icon: "\u{1F40D}", url: "python.html#scene2", companies: ["meta","google","amazon"], keywords: "mutable default shallow deep copy floor division is vs ==" },

    // ML
    { title: "Supervised Learning Algorithms", section: "3.1", topic: "Machine Learning", icon: "\u{1F916}", url: "ml.html#scene1", companies: ["meta","google","amazon"], keywords: "linear logistic regression decision tree random forest gradient boosting svm knn engagement spam recommendation" },
    { title: "Evaluation Metrics", section: "3.2", topic: "Machine Learning", icon: "\u{1F916}", url: "ml.html#scene1", companies: ["meta","google","amazon"], keywords: "accuracy precision recall f1 auc roc rmse mae confusion matrix" },
    { title: "Bias-Variance Tradeoff", section: "3.3", topic: "Machine Learning", icon: "\u{1F916}", url: "ml.html#scene2", companies: ["meta","google","amazon"], keywords: "bias variance overfitting underfitting regularization l1 l2 lasso ridge" },
    { title: "Feature Engineering", section: "3.4", topic: "Machine Learning", icon: "\u{1F916}", url: "ml.html#scene2", companies: ["meta","google","amazon"], keywords: "one-hot encoding scaling log transform target encoding feature" },

    // Stats
    { title: "Hypothesis Testing", section: "4.1", topic: "Statistics", icon: "\u{1F4CA}", url: "stats.html#scene1", companies: ["meta","google","amazon"], keywords: "null alternative p-value type I II error power significance experiment" },
    { title: "Confidence Intervals", section: "4.2", topic: "Statistics", icon: "\u{1F4CA}", url: "stats.html#scene1", companies: ["meta","google","amazon"], keywords: "confidence interval margin of error sample size width" },
    { title: "A/B Testing", section: "4.3", topic: "Statistics", icon: "\u{1F4CA}", url: "stats.html#scene2", companies: ["meta","google","amazon"], keywords: "ab test experiment peeking multiple comparisons novelty effect prime" },
    { title: "Central Limit Theorem", section: "4.4", topic: "Statistics", icon: "\u{1F4CA}", url: "stats.html#scene2", companies: ["meta","google","amazon"], keywords: "clt sample mean normal distribution standard error" },

    // Probability
    { title: "Bayes' Theorem", section: "5.1", topic: "Probability", icon: "\u{1F3B2}", url: "probability.html#scene1", companies: ["meta","google","amazon"], keywords: "bayes conditional probability prior posterior likelihood ad auction interview demand" },
    { title: "Key Distributions", section: "5.2", topic: "Probability", icon: "\u{1F3B2}", url: "probability.html#scene1", companies: ["meta","google","amazon"], keywords: "bernoulli binomial poisson geometric normal exponential distribution" },
    { title: "Expected Value & Variance", section: "5.3", topic: "Probability", icon: "\u{1F3B2}", url: "probability.html#scene2", companies: ["meta","google","amazon"], keywords: "expected value variance linearity of expectation" },
    { title: "Classic Interview Puzzles", section: "5.4", topic: "Probability", icon: "\u{1F3B2}", url: "probability.html#scene2", companies: ["meta","google","amazon"], keywords: "birthday problem monty hall coupon collector brain teaser puzzle forecast" },

    // Casing
    { title: "Product Metrics (AARRR)", section: "6.1", topic: "Case Studies", icon: "\u{1F4A1}", url: "casing.html#scene1", companies: ["meta","google","amazon"], keywords: "aarrr acquisition activation retention revenue referral pirate metrics north star product review" },
    { title: "Diagnosing Metric Changes", section: "6.2", topic: "Case Studies", icon: "\u{1F4A1}", url: "casing.html#scene1", companies: ["meta","google","amazon"], keywords: "metric drop diagnosis segment investigate data problem external internal" },
    { title: "Market Sizing", section: "6.3", topic: "Case Studies", icon: "\u{1F4A1}", url: "casing.html#scene2", companies: ["meta","google","amazon"], keywords: "market sizing top-down bottom-up fermi estimation growth" },
    { title: "Communicating Your Analysis", section: "6.4", topic: "Case Studies", icon: "\u{1F4A1}", url: "casing.html#scene2", companies: ["meta","google","amazon"], keywords: "communication pyramid principle quantify trade-offs structure" }
  ];

  let activeIdx = -1;

  function fuzzyMatch(query, text) {
    query = query.toLowerCase();
    text = text.toLowerCase();
    if (text.includes(query)) return 2;
    const words = query.split(/\s+/);
    let score = 0;
    for (const w of words) {
      if (text.includes(w)) score++;
    }
    return score > 0 ? score / words.length : 0;
  }

  function search(query) {
    if (!query.trim()) return [];
    const results = [];
    for (const item of INDEX) {
      const searchable = `${item.title} ${item.topic} ${item.section} ${item.keywords} ${item.companies.join(' ')}`;
      const score = fuzzyMatch(query, searchable);
      if (score > 0) results.push({ ...item, score });
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 12);
  }

  function renderResults(results) {
    const container = document.getElementById('searchResults');
    if (!container) return;
    if (results.length === 0) {
      container.innerHTML = '';
      return;
    }
    container.innerHTML = results.map((r, i) => {
      const badges = r.companies.map(c =>
        `<span class="company-badge ${c}">${c}</span>`
      ).join('');
      return `<a href="${r.url}" class="search-result${i === activeIdx ? ' active' : ''}" data-idx="${i}">
        <span class="sr-icon">${r.icon}</span>
        <div class="sr-info">
          <div class="sr-title">${r.section} ${r.title}</div>
          <div class="sr-sub">${r.topic}</div>
        </div>
        <div class="sr-badges">${badges}</div>
      </a>`;
    }).join('');
  }

  function updateActive() {
    document.querySelectorAll('.search-result').forEach((el, i) => {
      el.classList.toggle('active', i === activeIdx);
    });
  }

  window.openSearch = function() {
    const overlay = document.getElementById('searchOverlay');
    if (!overlay) return;
    overlay.classList.add('open');
    const input = document.getElementById('searchInput');
    if (input) { input.value = ''; input.focus(); }
    const container = document.getElementById('searchResults');
    if (container) container.innerHTML = '';
    activeIdx = -1;
  };

  window.closeSearch = function() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) overlay.classList.remove('open');
    activeIdx = -1;
  };

  document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
      return;
    }
    const overlay = document.getElementById('searchOverlay');
    if (!overlay || !overlay.classList.contains('open')) return;
    if (e.key === 'Escape') { closeSearch(); return; }
    const results = document.querySelectorAll('.search-result');
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, results.length - 1);
      updateActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      updateActive();
    } else if (e.key === 'Enter' && activeIdx >= 0 && activeIdx < results.length) {
      e.preventDefault();
      const href = results[activeIdx].getAttribute('href');
      if (href) window.location.href = href;
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('searchInput');
    if (input) {
      input.addEventListener('input', function() {
        activeIdx = -1;
        const results = search(this.value);
        renderResults(results);
      });
    }
  });

  if (document.readyState !== 'loading') {
    const input = document.getElementById('searchInput');
    if (input) {
      input.addEventListener('input', function() {
        activeIdx = -1;
        const results = search(this.value);
        renderResults(results);
      });
    }
  }
})();
