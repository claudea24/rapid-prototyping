// search.js — Global search with Cmd+K for v19 Company Playbook
(function() {
  const INDEX = [
    // SQL
    { title: "Query Execution Order", section: "1.1", topic: "SQL", icon: "\u{1F4C2}", url: "sql.html#s1-1", companies: ["google","amazon"], keywords: "select from where group by having order limit alias execution" },
    { title: "Joining Tables", section: "1.2", topic: "SQL", icon: "\u{1F4C2}", url: "sql.html#s1-2", companies: ["meta","google","amazon"], keywords: "inner left right full outer cross join self-join social graph" },
    { title: "Window Functions", section: "1.3", topic: "SQL", icon: "\u{1F4C2}", url: "sql.html#s1-3", companies: ["google","meta"], keywords: "row_number rank dense_rank partition over lag lead running total" },
    { title: "Aggregation & Grouping", section: "1.4", topic: "SQL", icon: "\u{1F4C2}", url: "sql.html#s1-4", companies: ["amazon","meta"], keywords: "group by having count sum avg null where vs having" },
    { title: "CTEs", section: "1.5", topic: "SQL", icon: "\u{1F4C2}", url: "sql.html#s1-5", companies: ["google"], keywords: "common table expression with recursive cte readable" },
    { title: "Query Optimisation", section: "1.6", topic: "SQL", icon: "\u{1F4C2}", url: "sql.html#s1-6", companies: ["amazon","google"], keywords: "explain index select star filter early exists performance" },

    // Python
    { title: "Data Structures & Complexity", section: "2.1", topic: "Python", icon: "\u{1F40D}", url: "python.html#s2-1", companies: ["google","amazon"], keywords: "list dict set deque heap hash map complexity O(n)" },
    { title: "Pandas for Data Manipulation", section: "2.2", topic: "Python", icon: "\u{1F40D}", url: "python.html#s2-2", companies: ["meta"], keywords: "dataframe groupby merge pivot table pandas agg" },
    { title: "NumPy for Numerical Computing", section: "2.3", topic: "Python", icon: "\u{1F40D}", url: "python.html#s2-3", companies: ["google"], keywords: "numpy array vectorization broadcasting dot product matrix" },
    { title: "Common Coding Patterns", section: "2.4", topic: "Python", icon: "\u{1F40D}", url: "python.html#s2-4", companies: ["meta","google","amazon"], keywords: "two pointer sliding window hash map two sum greedy" },
    { title: "Python Gotchas", section: "2.5", topic: "Python", icon: "\u{1F40D}", url: "python.html#s2-5", companies: ["google"], keywords: "mutable default shallow deep copy floor division is vs ==" },

    // ML
    { title: "Supervised Learning Algorithms", section: "3.1", topic: "Machine Learning", icon: "\u{1F916}", url: "ml.html#s3-1", companies: ["meta","google","amazon"], keywords: "linear logistic regression decision tree random forest gradient boosting svm knn" },
    { title: "Unsupervised Learning", section: "3.2", topic: "Machine Learning", icon: "\u{1F916}", url: "ml.html#s3-2", companies: ["google"], keywords: "k-means clustering hierarchical dbscan pca t-sne umap" },
    { title: "Evaluation Metrics", section: "3.3", topic: "Machine Learning", icon: "\u{1F916}", url: "ml.html#s3-3", companies: ["meta","amazon"], keywords: "accuracy precision recall f1 auc roc rmse mae confusion matrix" },
    { title: "Bias-Variance Tradeoff", section: "3.4", topic: "Machine Learning", icon: "\u{1F916}", url: "ml.html#s3-4", companies: ["meta","google","amazon"], keywords: "bias variance overfitting underfitting regularization l1 l2 lasso ridge" },
    { title: "Feature Engineering", section: "3.5", topic: "Machine Learning", icon: "\u{1F916}", url: "ml.html#s3-5", companies: ["meta","amazon"], keywords: "one-hot encoding scaling log transform target encoding feature" },
    { title: "Cross-Validation & Data Leakage", section: "3.6", topic: "Machine Learning", icon: "\u{1F916}", url: "ml.html#s3-6", companies: ["google"], keywords: "k-fold time series cross validation leakage pipeline" },

    // Stats
    { title: "Descriptive Statistics", section: "4.1", topic: "Statistics", icon: "\u{1F4CA}", url: "stats.html#s4-1", companies: ["meta","google","amazon"], keywords: "mean median mode variance standard deviation iqr" },
    { title: "Hypothesis Testing", section: "4.2", topic: "Statistics", icon: "\u{1F4CA}", url: "stats.html#s4-2", companies: ["meta"], keywords: "null alternative p-value type I II error power significance" },
    { title: "Common Statistical Tests", section: "4.3", topic: "Statistics", icon: "\u{1F4CA}", url: "stats.html#s4-3", companies: ["google"], keywords: "t-test z-test chi-squared anova mann-whitney paired" },
    { title: "Confidence Intervals", section: "4.4", topic: "Statistics", icon: "\u{1F4CA}", url: "stats.html#s4-4", companies: ["meta","amazon"], keywords: "confidence interval margin of error sample size width" },
    { title: "A/B Testing", section: "4.5", topic: "Statistics", icon: "\u{1F4CA}", url: "stats.html#s4-5", companies: ["meta","amazon"], keywords: "ab test experiment peeking multiple comparisons novelty effect" },
    { title: "Central Limit Theorem", section: "4.6", topic: "Statistics", icon: "\u{1F4CA}", url: "stats.html#s4-6", companies: ["google"], keywords: "clt sample mean normal distribution standard error" },

    // Probability
    { title: "Fundamentals", section: "5.1", topic: "Probability", icon: "\u{1F3B2}", url: "probability.html#s5-1", companies: ["google"], keywords: "addition multiplication complement permutations combinations independence" },
    { title: "Bayes' Theorem", section: "5.2", topic: "Probability", icon: "\u{1F3B2}", url: "probability.html#s5-2", companies: ["google","meta"], keywords: "bayes conditional probability prior posterior likelihood" },
    { title: "Key Distributions", section: "5.3", topic: "Probability", icon: "\u{1F3B2}", url: "probability.html#s5-3", companies: ["google"], keywords: "bernoulli binomial poisson geometric normal exponential distribution" },
    { title: "Expected Value & Variance", section: "5.4", topic: "Probability", icon: "\u{1F3B2}", url: "probability.html#s5-4", companies: ["google","amazon"], keywords: "expected value variance linearity of expectation" },
    { title: "Law of Large Numbers", section: "5.5", topic: "Probability", icon: "\u{1F3B2}", url: "probability.html#s5-5", companies: ["meta"], keywords: "law of large numbers convergence sample mean" },
    { title: "Classic Interview Puzzles", section: "5.6", topic: "Probability", icon: "\u{1F3B2}", url: "probability.html#s5-6", companies: ["google"], keywords: "birthday problem monty hall coupon collector brain teaser puzzle" },

    // Casing
    { title: "Product Metrics (AARRR)", section: "6.1", topic: "Case Studies", icon: "\u{1F4A1}", url: "casing.html#s6-1", companies: ["meta","amazon"], keywords: "aarrr acquisition activation retention revenue referral pirate metrics north star" },
    { title: "Structuring Your Approach", section: "6.2", topic: "Case Studies", icon: "\u{1F4A1}", url: "casing.html#s6-2", companies: ["meta","google","amazon"], keywords: "clarify define metrics hypothesize analyze recommend measure framework" },
    { title: "Diagnosing Metric Changes", section: "6.3", topic: "Case Studies", icon: "\u{1F4A1}", url: "casing.html#s6-3", companies: ["meta","amazon"], keywords: "metric drop diagnosis segment investigate data problem external internal" },
    { title: "Market Sizing", section: "6.4", topic: "Case Studies", icon: "\u{1F4A1}", url: "casing.html#s6-4", companies: ["google","amazon"], keywords: "market sizing top-down bottom-up fermi estimation piano tuners" },
    { title: "Experiment Design", section: "6.5", topic: "Case Studies", icon: "\u{1F4A1}", url: "casing.html#s6-5", companies: ["meta","amazon"], keywords: "experiment design randomization power analysis guardrail novelty network effects" },
    { title: "Communicating Your Analysis", section: "6.6", topic: "Case Studies", icon: "\u{1F4A1}", url: "casing.html#s6-6", companies: ["meta","google","amazon"], keywords: "communication pyramid principle quantify trade-offs structure" }
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

  function updateActive(results) {
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
    // Cmd+K or Ctrl+K to open
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
      return;
    }

    const overlay = document.getElementById('searchOverlay');
    if (!overlay || !overlay.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeSearch();
      return;
    }

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

  // Input handler
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

  // Also bind if DOM already loaded
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
