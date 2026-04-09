import Link from "next/link";
import React from "react";

export default function BackButton() {
  return (
    <Link
      href="/admin/projects"
      className="text-gray-400 hover:text-white transition-colors"
    >
                ← Back to Projects

    </Link>
  );
}
