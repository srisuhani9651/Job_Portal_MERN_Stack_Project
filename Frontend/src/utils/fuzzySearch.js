// Levenshtein distance for typo tolerance in fuzzy matching
export const levenshteinDistance = (a, b) => {
  if (!a) return b ? b.length : 0;
  if (!b) return a ? a.length : 0;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

// Synonyms & related domain terms dictionary for intelligent job discovery
const synonymMap = {
  react: ["reactjs", "react.js", "frontend", "front-end", "javascript", "ui", "web", "developer"],
  reactjs: ["react", "react.js", "frontend", "javascript", "ui"],
  frontend: ["front-end", "front end", "ui", "ux", "web", "react", "angular", "vue", "client", "developer", "html", "css"],
  backend: ["back-end", "back end", "server", "node", "nodejs", "node.js", "express", "api", "python", "java", "golang", "developer"],
  developer: ["engineer", "programmer", "dev", "sde", "software", "coder"],
  dev: ["developer", "engineer", "software"],
  engineer: ["developer", "programmer", "dev", "sde", "software"],
  software: ["developer", "engineer", "sde", "programmer"],
  fullstack: ["full stack", "full-stack", "mern", "mean", "web developer", "software developer"],
  "full stack": ["fullstack", "full-stack", "mern", "mean", "web developer", "software developer"],
  "full-stack": ["fullstack", "full stack", "mern", "mean", "web developer"],
  mern: ["fullstack", "full stack", "mongodb", "express", "react", "node"],
  node: ["nodejs", "node.js", "backend", "express", "javascript"],
  nodejs: ["node", "node.js", "backend", "express"],
  data: ["data analyst", "data scientist", "data science", "analytics", "analysis", "bi", "sql", "ai", "ml", "machine learning"],
  analyst: ["analysis", "analytics", "data analyst", "business analyst", "data"],
  analytics: ["analyst", "data", "analysis", "bi", "metrics"],
  remote: ["work from home", "wfh", "anywhere", "hybrid"],
  designer: ["ui", "ux", "graphic", "visual", "product design", "figma", "illustrator"],
  design: ["designer", "ui", "ux", "graphic"],
  python: ["django", "flask", "fastapi", "data", "machine learning", "backend"],
  java: ["spring", "springboot", "spring boot", "backend", "microservices"],
  ai: ["ml", "machine learning", "artificial intelligence", "data science", "deep learning"],
  ml: ["ai", "machine learning", "data science", "deep learning"],
};

// Normalization helper
const normalize = (text) => {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Checks if a search token matches target words directly, through synonyms, or with typo tolerance
 */
export const fuzzyMatchWord = (queryWord, targetWords) => {
  if (!queryWord || !targetWords || targetWords.length === 0) return false;

  const q = queryWord.toLowerCase().trim();
  if (!q) return false;

  // 1. Direct equality or substring match
  for (const t of targetWords) {
    if (t === q || t.includes(q) || q.includes(t)) {
      return true;
    }
  }

  // 2. Synonym & related terminology matching
  const synonyms = synonymMap[q] || [];
  for (const syn of synonyms) {
    for (const t of targetWords) {
      if (t === syn || t.includes(syn) || syn.includes(t)) {
        return true;
      }
    }
  }

  // 3. Typo tolerance using Levenshtein distance
  const maxDistance = q.length <= 4 ? 1 : q.length <= 7 ? 2 : 3;
  for (const t of targetWords) {
    if (Math.abs(t.length - q.length) <= maxDistance) {
      if (levenshteinDistance(q, t) <= maxDistance) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Filters list of jobs using intelligent fuzzy search
 */
export const filterJobsFuzzy = (jobs = [], searchQuery = "") => {
  const query = normalize(searchQuery);
  if (!query) return jobs || [];

  const queryWords = query.split(/\s+/).filter(Boolean);

  return (jobs || []).filter((job) => {
    if (!job) return false;

    const title = normalize(job.title);
    const description = normalize(job.description);
    const location = normalize(job.location);
    const jobType = normalize(job.jobType);
    const companyName = normalize(
      typeof job.company === "object" ? job.company?.name : job.company
    );
    const requirements = Array.isArray(job.requirements)
      ? job.requirements.map(normalize).join(" ")
      : normalize(job.requirements);

    const fullJobText = `${title} ${description} ${companyName} ${location} ${jobType} ${requirements}`;

    // 1. Fast direct substring on combined text
    if (fullJobText.includes(query)) {
      return true;
    }

    // 2. Tokenize job content
    const jobWords = fullJobText.split(/\s+/).filter((w) => w.length > 1);

    // 3. Check every query word matches at least one target word/synonym/fuzzy distance
    const allQueryWordsMatch = queryWords.every((qWord) => {
      if (title.includes(qWord) || requirements.includes(qWord) || companyName.includes(qWord)) {
        return true;
      }
      return fuzzyMatchWord(qWord, jobWords);
    });

    return allQueryWordsMatch;
  });
};
