import { ref } from 'vue';

export interface StatLang {
  name: string;
  percent: number;
  color: string;
  bytes?: number;
  /** estimated lines of code in this language */
  lines?: number;
}
export interface RepoStat {
  name: string;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  description?: string;
  /** open issues + PRs (GitHub's open_issues_count) */
  issues?: number;
  /** latest release tag, if the repo has releases */
  release?: string;
}
export interface SiteStats {
  generatedAt: string;
  user: { repos: number; stars: number; forks: number; followers?: number; following?: number };
  /** total estimated lines of code across top languages */
  linesOfCode?: number;
  languages: StatLang[];
  topRepos: RepoStat[];
  repos: Record<string, RepoStat>;
}

// Shared singleton — fetched once, reused by every component.
const stats = ref<SiteStats | null>(null);
let started = false;

export function useStats() {
  if (!started && typeof fetch !== 'undefined') {
    started = true;
    fetch('/data/stats.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && d.user) stats.value = d as SiteStats;
      })
      .catch(() => {
        /* keep null → components use their fallbacks */
      });
  }
  return { stats };
}
