import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? 'gaziraihan1';
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}`;
const CACHE_KEY = 'home:github';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const FETCH_TIMEOUT = 5000;

const githubHeaders = {
  'Accept': 'application/vnd.github.v3+json',
  ...(process.env.GITHUB_TOKEN && {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`,
  }),
};


interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

interface GitHubUser {
  followers: number;
  public_repos: number;
}

export interface GitHubStats {
  followers: number;
  publicRepos: number;
  totalStars: number;
  topRepos: Array<{
    name: string;
    description: string | null;
    stars: number;
    language: string | null;
    url: string;
  }>;
}

const FALLBACK_STATS: GitHubStats = {
  followers: 0,
  publicRepos: 0,
  totalStars: 0,
  topRepos: [],
};


async function fetchWithTimeout(url: string, signal: AbortSignal): Promise<Response> {
  const res = await fetch(url, {
    signal,
    headers: githubHeaders,
    next: { revalidate: CACHE_TTL / 1000 },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} for ${url}`);
  }

  return res;
}


export async function GET() {
  const cached = cache.get<GitHubStats>(CACHE_KEY);
  if (cached) {
    return NextResponse.json(cached);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const [userRes, reposRes] = await Promise.all([
      fetchWithTimeout(GITHUB_API, controller.signal),
      fetchWithTimeout(`${GITHUB_API}/repos?per_page=100&sort=stars`, controller.signal),
    ]);

    clearTimeout(timeoutId);

    const [userData, repos]: [GitHubUser, GitHubRepo[]] = await Promise.all([
      userRes.json(),
      reposRes.json(),
    ]);

    const stats: GitHubStats = {
      followers: userData.followers ?? 0,
      publicRepos: userData.public_repos ?? 0,
      totalStars: repos.reduce((acc, repo) => acc + (repo.stargazers_count ?? 0), 0),
      topRepos: repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count) // top by stars, not recency
        .slice(0, 3)
        .map((repo) => ({
          name: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          language: repo.language,
          url: repo.html_url,
        })),
    };

    cache.set(CACHE_KEY, stats, CACHE_TTL);

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL / 1000}, stale-while-revalidate=60`,
      },
    });

  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('GitHub API request timed out');
    } else {
      console.error('Error fetching GitHub stats:', error);
    }

    return NextResponse.json(FALLBACK_STATS, {
      status: 200, // 200 so the card still renders gracefully
      headers: {
        'Cache-Control': 'no-store', // don't cache error responses
      },
    });
  }
}