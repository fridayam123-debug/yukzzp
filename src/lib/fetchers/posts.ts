import { createPublicClient } from '@/lib/supabase/service'

export type PostCategory = 'NOTICE' | 'JOURNAL' | 'STORY'

export interface Post {
  id: string
  title: string
  excerpt: string | null
  content: string
  category: PostCategory
  thumbnail_url: string | null
  slug: string
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export async function getPosts(category?: PostCategory): Promise<Post[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const supabase = createPublicClient()
    let query = supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
    if (category) query = query.eq('category', category)
    const { data, error } = await query
    if (error) console.error('[getPosts] error:', error)
    return (data ?? []) as Post[]
  } catch {
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    if (error) return null
    return data as Post
  } catch {
    return null
  }
}

export async function getLatestPosts(limit = 3): Promise<Post[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit)
    if (error) console.error('[getLatestPosts] error:', error)
    return (data ?? []) as Post[]
  } catch {
    return []
  }
}
