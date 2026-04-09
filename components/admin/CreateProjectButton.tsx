"use client"
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui'

export default function CreateProjectButton() {
  return (
    <Button asChild>
        <Link href="/admin/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Link>

    </Button>
  )
}
