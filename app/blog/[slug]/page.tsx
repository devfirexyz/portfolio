import { notFound } from "next/navigation";
import { BlogLayout } from "@/components/blog/BlogLayout";
import BlogPostClient from "@/components/blog/BlogPostClient";
import { getAllPosts } from "@/lib/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.filter((post) => !post.draft).map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const allPosts = await getAllPosts();
  const post = allPosts.find((entry) => entry.slug === slug);
  const author = null; // Mock author data

  if (!post || post.draft) {
    notFound();
  }

  return (
    <BlogLayout showBackButton={true}>
      <BlogPostClient post={post} allPosts={allPosts} author={author} />
    </BlogLayout>
  );
}
