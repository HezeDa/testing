"use client"

import { BlogForm } from "@/components/blog/blog-form"

export default function NewBlogPage() {
  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Новая статья</h1>
        </div>
        <BlogForm />
      </div>
    </div>
  )
}
