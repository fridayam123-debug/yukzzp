'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type PostCategory = 'NOTICE' | 'JOURNAL' | 'STORY'

export interface PostInput {
  title: string
  excerpt: string
  content: string
  category: PostCategory
  thumbnail_url: string
  slug: string
  is_published: boolean
  published_at: string | null
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export async function createPost(input: PostInput) {
  const supabase = await createClient()
  const slug = input.slug || slugify(input.title) + '-' + Date.now()
  const { data, error } = await supabase
    .from('posts')
    .insert({
      ...input,
      slug,
      published_at: input.is_published ? (input.published_at || new Date().toISOString()) : null,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/notice')
  return data
}

export async function updatePost(id: string, input: Partial<PostInput>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
      published_at: input.is_published ? (input.published_at || new Date().toISOString()) : null,
    })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/notice')
  return data
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/notice')
}

export async function getAllPostsAdmin() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}
