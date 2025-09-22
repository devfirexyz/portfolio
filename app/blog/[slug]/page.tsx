import { notFound } from "next/navigation";
import { BlogLayout } from "@/components/blog/BlogLayout";
import BlogPostClient from "@/components/blog/BlogPostClient";
import type { BlogPost } from "@/types/blog";
import { getPostBySlug, getAllPosts } from "@/lib/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const author = null; // Mock author data
  const allPosts = await getAllPosts();

  if (!post || post.draft) {
    notFound();
  }

  return (
    <BlogLayout showBackButton={true}>
      <BlogPostClient post={post} allPosts={allPosts} author={author} />
    </BlogLayout>
  );
}