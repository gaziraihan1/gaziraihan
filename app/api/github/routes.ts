// app/api/github-stats/route.ts
import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';

const GITHUB_API = 'https://api.github.com/users/gaziraihan1';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function GET() {
  // ✅ Try cache first
  const cached = cache.get('home:github');
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    // ✅ Fetch from GitHub API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(`${GITHUB_API}/repos?per_page=6&sort=updated`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Add token if available:
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: CACHE_TTL / 1000 }, // ✅ Next.js cache hint
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }
    
    const repos = await res.json();
    
    // ✅ Fetch user data too
    const userRes = await fetch(GITHUB_API, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      next: { revalidate: CACHE_TTL / 1000 },
    });
    
    const userData = await userRes.json();
    
// app/api/github-stats/route.ts (ensure it returns the right shape)
  // ... existing fetch logic ...
  
  const stats = {
    followers: userData.followers || 0,
    publicRepos: userData.public_repos || 0,
    totalStars: repos.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0),
    // ✅ Include topRepos for the card
    topRepos: repos.slice(0, 3).map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      language: repo.language,
      url: repo.html_url,
    })),
  };
  
    // ✅ Cache the result
    cache.set('home:github', stats, CACHE_TTL);
    
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL / 1000}, stale-while-revalidate=60`,
      },
    });
    
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    
    // ✅ Return fallback data
    return NextResponse.json({
      followers: 0,
      publicRepos: 0,
      topRepos: [],
    }, { status: 200 }); // ✅ 200 so page still renders
  }
}