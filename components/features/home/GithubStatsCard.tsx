'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, Code, ExternalLink, RefreshCw } from 'lucide-react';
import { BentoCard } from '@/components/animations/BentoCard';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

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
  initialStats?: GitHubStats | null; 
}


const FALLBACK_STATS: GitHubStats = {
  followers: 0,
  publicRepos: 0,
  totalStars: 0,
  topRepos: [],
};

const USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? 'gaziraihan1';


function formatNumber(num: number | undefined | null): string {
  const safeNum = Number(num);
  if (!Number.isFinite(safeNum)) return '0';
  if (safeNum >= 1_000_000) return (safeNum / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (safeNum >= 1_000) return (safeNum / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return safeNum.toString();
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: number | undefined;
  title: string;
  delay: number;
}

function StatRow({ icon, label, value, title, delay }: StatRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center justify-between group"
    >
      <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-lg font-bold text-white tabular-nums" title={title}>
        {formatNumber(value)}
      </span>
    </motion.div>
  );
}


export function GitHubStatsCard({ initialStats }: GitHubStatsCardProps) {
  const [stats, setStats] = useState<GitHubStats | null>(initialStats ?? null);
  const [loading, setLoading] = useState(!initialStats);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('/api/github-stats', {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data: GitHubStats = await res.json();
      setStats(data);

    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timed out');
        } else if (err.message.includes('429')) {
          setError('Rate limit exceeded');
        } else {
          setError('Failed to load stats');
        }
      }
      setStats(FALLBACK_STATS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialStats) return;
    fetchStats();
  }, [initialStats, fetchStats]);

  return (
    <div className="md:col-span-1 md:row-span-1">
      <BentoCard gradientColor="indigo" className="h-full">
        <div className="flex flex-col h-full">

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FaGithub className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">GitHub</h3>
            </div>
            {error && (
              <button
                onClick={fetchStats}
                disabled={loading}
                aria-label="Retry loading GitHub stats"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Retry
              </button>
            )}
          </div>

          {loading && (
            <div className="flex-1 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
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

          {error && !loading && !stats && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-sm text-center">
                {error}
                <br />
                <span className="text-xs">Stats unavailable</span>
              </p>
            </div>
          )}

          {stats && !loading && (
            <div className="flex-1 space-y-4">
              <StatRow
                icon={<Star className="w-4 h-4" />}
                label="Followers"
                value={stats.followers}
                title={`${stats.followers} followers`}
                delay={0.1}
              />
              <StatRow
                icon={<Code className="w-4 h-4" />}
                label="Repositories"
                value={stats.publicRepos}
                title={`${stats.publicRepos} repositories`}
                delay={0.2}
              />
              <StatRow
                icon={<GitFork className="w-4 h-4" />}
                label="Total Stars"
                value={stats.totalStars}
                title={`${stats.totalStars} total stars`}
                delay={0.3}
              />

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
                        key={repo.url || index}
                        href={repo.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-gray-400 hover:text-indigo-400 transition-colors truncate"
                        title={repo.description ?? repo.name}
                      >
                        <span className="font-medium text-white">{repo.name}</span>
                        {repo.language && (
                          <span className="text-gray-500"> · {repo.language}</span>
                        )}
                        <span className="text-indigo-400"> ★ {formatNumber(repo.stars)}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-white/10">
            <Link
              href={`https://github.com/${USERNAME}`}
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