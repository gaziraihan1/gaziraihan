// components/features/home/github-stats-card.tsx
'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, Code, ExternalLink, RefreshCw } from 'lucide-react';
import { BentoCard } from '@/components/animations/BentoCard';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

// ✅ Interface for GitHub stats (all fields nullable-safe)
export interface GitHubStats {
  followers: number;
  publicRepos: number;
  totalStars: number;
  topRepos?: Array<{
    name: string;
    description: string | null;
    stars: number;
    language: string | null;
    url: string;
  }>;
}

interface GitHubStatsCardProps {
  githubStats?: GitHubStats | null;
  username?: string;
}

export function GitHubStatsCard({ githubStats: initialStats, username: propUsername }: GitHubStatsCardProps) {
  // ✅ Initialize with safe defaults to prevent undefined
  const [stats, setStats] = useState<GitHubStats | null>(
    initialStats 
      ? {
          followers: initialStats.followers ?? 0,
          publicRepos: initialStats.publicRepos ?? 0,
          totalStars: initialStats.totalStars ?? 0,
          topRepos: initialStats.topRepos,
        }
      : null
  );
  const [loading, setLoading] = useState(!initialStats);
  const [error, setError] = useState<string | null>(null);
  
  const username = useMemo(() => {
    return propUsername || process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'yourusername';
  }, [propUsername]);

  useEffect(() => {
    if (initialStats) return;

    let isMounted = true;
    
    async function fetchGitHubStats() {
      try {
        setLoading(true);
        setError(null);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const userRes = await fetch(`https://api.github.com/users/${username}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
              'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            }),
          },
          next: { revalidate: 1800 },
        });
        
        if (!userRes.ok) {
          throw new Error(`GitHub API error: ${userRes.status}`);
        }
        
        const userData = await userRes.json();
        
        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
          {
            signal: controller.signal,
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              ...(process.env.NEXT_PUBLIC_GITHUB_TOKEN && {
                'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
              }),
            },
            next: { revalidate: 1800 },
          }
        );
        
        if (!reposRes.ok) {
          throw new Error(`GitHub repos API error: ${reposRes.status}`);
        }
        
        const reposData = await reposRes.json();
        
        // ✅ Safe reduce with null checks
        const totalStars = reposData?.reduce?.(
          (acc: number, repo: any) => acc + (repo?.stargazers_count || 0), 
          0
        ) || 0;
        
        clearTimeout(timeoutId);
        
        if (isMounted) {
          // ✅ Ensure all values are valid numbers with defaults
          setStats({
            followers: Number(userData?.followers) || 0,
            publicRepos: Number(userData?.public_repos) || 0,
            totalStars,
            topRepos: reposData?.slice?.(0, 3)?.map((repo: any) => ({
              name: repo?.name || 'Unknown',
              description: repo?.description,
              stars: repo?.stargazers_count || 0,
              language: repo?.language,
              url: repo?.html_url || '#',
            })) || [],
          });
        }
        
      } catch (error: any) {
        console.error('Error fetching GitHub stats:', error);
        
        if (error.name === 'AbortError') {
          setError('Request timed out');
        } else if (error.message?.includes('403')) {
          setError('Rate limit exceeded');
        } else {
          setError('Failed to load stats');
        }
        
        if (isMounted) {
          // ✅ Set safe fallback stats with guaranteed numbers
          setStats({ 
            followers: 0, 
            publicRepos: 0, 
            totalStars: 0,
            topRepos: [],
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchGitHubStats();
    
    return () => {
      isMounted = false;
    };
  }, [initialStats, username]);

  // ✅ FIXED: Safe formatNumber that handles undefined/null/non-number values
  const formatNumber = (num: number | undefined | null): string => {
    // ✅ Handle undefined, null, or non-finite numbers
    const safeNum = Number(num);
    if (!Number.isFinite(safeNum)) {
      return '0';
    }
    
    if (safeNum >= 1_000_000) {
      return (safeNum / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (safeNum >= 1_000) {
      return (safeNum / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    // ✅ Safe toString with fallback
    return safeNum.toString();
  };

  return (
    <div className="md:col-span-1 md:row-span-1">
      <BentoCard gradientColor="indigo" className="h-full">
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FaGithub className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">GitHub</h3>
            </div>
            {error && !initialStats && (
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  setStats(null);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                disabled={loading}
                aria-label="Retry loading GitHub stats"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Retry
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex-1 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-5 w-12" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && !stats && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-sm text-center">
                {error}
                <br />
                <span className="text-xs">Stats unavailable</span>
              </p>
            </div>
          )}

          {/* Stats Display */}
          {stats && !loading && (
            <div className="flex-1 space-y-4">
              {/* Followers - ✅ Safe number access with ?? operator */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">Followers</span>
                </div>
                <span 
                  className="text-lg font-bold text-white tabular-nums" 
                  title={`${stats.followers ?? 0} followers`}
                >
                  {formatNumber(stats.followers)}
                </span>
              </motion.div>

              {/* Repositories */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                  <Code className="w-4 h-4" />
                  <span className="text-sm">Repositories</span>
                </div>
                <span 
                  className="text-lg font-bold text-white tabular-nums"
                  title={`${stats.publicRepos ?? 0} repositories`}
                >
                  {formatNumber(stats.publicRepos)}
                </span>
              </motion.div>

              {/* Total Stars */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                  <GitFork className="w-4 h-4" />
                  <span className="text-sm">Total Stars</span>
                </div>
                <span 
                  className="text-lg font-bold text-white tabular-nums"
                  title={`${stats.totalStars ?? 0} total stars`}
                >
                  {formatNumber(stats.totalStars)}
                </span>
              </motion.div>

              {/* Top Repos (if available) */}
              {stats.topRepos && stats.topRepos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 mt-4 border-t border-white/10"
                >
                  <p className="text-xs text-gray-500 mb-2">Top Repos</p>
                  <div className="space-y-2">
                    {stats.topRepos.map((repo, index) => (
                      <Link
                        key={repo?.url || index}
                        href={repo?.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-gray-400 hover:text-indigo-400 transition-colors truncate"
                        title={repo?.description || repo?.name || 'Unknown repo'}
                      >
                        <span className="font-medium text-white">{repo?.name || 'Unknown'}</span>
                        {repo?.language && (
                          <span className="text-gray-500"> · {repo.language}</span>
                        )}
                        <span className="text-indigo-400"> ★ {formatNumber(repo?.stars)}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Footer Link */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group"
            >
              View Profile
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </BentoCard>
    </div>
  );
}