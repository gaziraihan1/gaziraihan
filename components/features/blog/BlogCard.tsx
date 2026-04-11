"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: Date | null;
    thumbnail?: string | null;
    tags: Array<{ id: string; name: string; slug: string; color: string }>;
    author?: { name: string | null } | null;
  };
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC", 
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const readingTime = Math.ceil(post.excerpt.split(" ").length / 200) + 3;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden bg-white/5 border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col">
        {post.thumbnail && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 384px"

              fetchPriority="high"
              loading={'lazy'}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex flex-wrap gap-1.5 mb-3">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.slice(0, 3).map((tag) => {
                const safeColor = tag.color || "#ffffff";

                return (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-[10px] px-2 py-0.5"
                    style={{
                      borderColor: `${safeColor}40`,
                      color: safeColor,
                    }}
                  >
                    {tag.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-sm text-gray-400 line-clamp-3 mb-4">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{readingTime} min read</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="w-full group/btn"
          >
            <Link href={`/blog/${post.slug}`} prefetch={true}>
              Read Article
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
