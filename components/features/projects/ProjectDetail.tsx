// components/features/projects/project-detail.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, Clock, GitGraph } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectMetrics } from './ProjectMetrics';
import { ProjectMarkdown } from './ProjectMarkdown';
import { ProjectGallery } from './ProjectGallery';
import { ProjectNavigation } from './ProjectNavigation';

import type { ProjectDetailProps } from '@/types/project';


export function ProjectDetail({ project, previousProject, nextProject }: ProjectDetailProps) {
  return (
    <article className="min-h-screen bg-[#0a0a0a]">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-16">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/projects">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Title & Meta */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  style={{ borderColor: tag.color + '40', color: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {project.title}
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
              {project.summary}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Case Study</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>{project.status}</span>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 mb-8">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap gap-4 mb-16">
            {project.demoUrl && (
              <Button asChild size="lg">
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live Demo
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button variant="outline" size="lg" asChild>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <GitGraph className="mr-2 h-4 w-4" />
                  View Source Code
                </a>
              </Button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Key Metrics */}
      {project.metrics.length > 0 && (
        <section className="bg-white/5 border-y border-white/10 py-16 mb-16">
          <div className="container mx-auto px-4">
            <ProjectMetrics metrics={project.metrics} />
          </div>
        </section>
      )}

      {/* Main Content (Case Study) */}
      <section className="container mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar (Sticky) */}
          <aside className="lg:col-span-4 lg:order-2">
            <div className="sticky top-24 space-y-8">
              {/* Project Overview Card */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Project Overview</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Role</p>
                      <p className="text-white">Full Stack Developer</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Timeline</p>
                      <p className="text-white">3 Months</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Client</p>
                      <p className="text-white">Confidential / Open Source</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tech Stack */}
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Content (Markdown) */}
          <div className="lg:col-span-8 lg:order-1">
            <ProjectMarkdown content={project.description} />
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.images && project.images.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Project Gallery</h2>
          <ProjectGallery images={project.images} />
        </section>
      )}

      {/* Navigation */}
      <section className="container mx-auto px-4 mb-20">
        <ProjectNavigation 
          previous={previousProject} 
          next={nextProject} 
        />
      </section>
    </article>
  );
}