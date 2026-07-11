// Generates public/data/stats.json from the GitHub API.
// Runs in CI (Node 20+, global fetch). Uses GH_TOKEN for higher rate limits.
// The site reads /data/stats.json at runtime, so stars/languages stay fresh
// without hitting the GitHub API per visitor.
import { writeFileSync, mkdirSync } from 'node:fs';

const USER = 'Vadim-Khristenko';
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': USER,
  'X-GitHub-Api-Version': '2022-11-28',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

// Linguist-ish colors for the language bar.
const LANG_COLORS = {
  Rust: '#dea584', TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
  Go: '#00ADD8', C: '#555555', 'C++': '#f34b7d', 'C#': '#178600', HTML: '#e34c26',
  CSS: '#563d7c', SCSS: '#c6538c', Vue: '#41b883', Astro: '#ff5a03', Shell: '#89e051',
  Kotlin: '#A97BFF', Java: '#b07219', PHP: '#4F5D95', Lua: '#000080', Ruby: '#701516',
  Swift: '#F05138', Dart: '#00B4AB', Zig: '#ec915c', Nim: '#ffc200', Haskell: '#5e5086',
  Dockerfile: '#384d54', Makefile: '#427819', TeX: '#3D6117', Jupyter: '#DA5B0B',
};

// Rough avg bytes-per-line per language → lets us estimate lines of code from
// the GitHub /languages byte counts (GitHub doesn't expose LoC directly).
const BYTES_PER_LINE = {
  Rust: 34, TypeScript: 33, JavaScript: 33, Python: 30, Go: 30, C: 32, 'C++': 34,
  'C#': 34, HTML: 42, CSS: 28, SCSS: 28, Vue: 34, Astro: 36, Shell: 28, PowerShell: 36,
  Kotlin: 34, Java: 36, PHP: 32, Lua: 28, Ruby: 28, Swift: 34, Dart: 32, Zig: 32,
  Nim: 28, Haskell: 30, Svelte: 34,
};
const DEFAULT_BPL = 34;

// Fetch JSON with retries. Transient network failures (connect timeouts, dropped
// sockets) are retried with linear backoff so one flaky moment doesn't sink the
// whole run — HTTP errors like 404 are thrown immediately for the caller to handle.
async function gh(url, tries = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      const r = await fetch(url, { headers });
      if (!r.ok) throw new Error(`${r.status} ${r.statusText} — ${url}`);
      return r.json();
    } catch (e) {
      const networkFail = e.name === 'TypeError' || !!e.cause;
      if (!networkFail || attempt >= tries) throw e;
      await new Promise((res) => setTimeout(res, 1000 * attempt));
    }
  }
}

async function allRepos() {
  const repos = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await gh(
      `https://api.github.com/users/${USER}/repos?per_page=100&page=${page}&type=owner&sort=updated`
    );
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos; // nothing excluded — totals count stars/forks across ALL owned repos
}

const user = await gh(`https://api.github.com/users/${USER}`);
const repos = await allRepos();

let stars = 0;
let forks = 0;
const langBytes = {};
const repoMap = {};

for (const r of repos) {
  stars += r.stargazers_count;
  forks += r.forks_count;
  repoMap[r.name.toLowerCase()] = {
    name: r.name,
    stars: r.stargazers_count,
    forks: r.forks_count,
    issues: r.open_issues_count, // GitHub counts open issues + PRs here
    language: r.language || null,
    url: r.html_url,
    description: r.description || '',
  };
  // Language + release detail only for his OWN code — forks/mirrors would
  // otherwise inflate the language breakdown with other people's bytes.
  if (!r.fork && !r.archived) {
    try {
      const langs = await gh(r.languages_url);
      for (const [k, v] of Object.entries(langs)) langBytes[k] = (langBytes[k] || 0) + v;
    } catch (e) {
      // ignore a single repo's language failure
    }
    // latest release tag, if the repo publishes releases
    try {
      const rel = await gh(`https://api.github.com/repos/${USER}/${r.name}/releases/latest`);
      if (rel && rel.tag_name) repoMap[r.name.toLowerCase()].release = rel.tag_name;
    } catch (e) {
      // no releases → skip
    }
  }
}

const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1;
const languages = Object.entries(langBytes)
  .map(([name, bytes]) => ({
    name,
    bytes,
    // estimated lines of code (GitHub only exposes bytes)
    lines: Math.round(bytes / (BYTES_PER_LINE[name] || DEFAULT_BPL)),
    percent: +((bytes / totalBytes) * 100).toFixed(1),
    color: LANG_COLORS[name] || '#8b8b8b',
  }))
  .sort((a, b) => b.bytes - a.bytes)
  .slice(0, 10);
const linesOfCode = languages.reduce((a, l) => a + l.lines, 0);

const topRepos = Object.values(repoMap)
  .sort((a, b) => b.stars - a.stars)
  .slice(0, 6);

const out = {
  generatedAt: new Date().toISOString(),
  user: {
    // every owned repo counted (incl. forks/archived) so nothing is missed
    repos: repos.length,
    publicRepos: user.public_repos,
    stars, // summed across ALL owned repos
    forks, // summed across ALL owned repos
    followers: user.followers,
    following: user.following,
  },
  linesOfCode,
  languages,
  topRepos,
  repos: repoMap,
};

mkdirSync('public/data', { recursive: true });
writeFileSync('public/data/stats.json', JSON.stringify(out, null, 2) + '\n');
console.log(`stats: ${repos.length} repos · ${stars}★ · ${forks} forks · ${languages.length} langs`);
