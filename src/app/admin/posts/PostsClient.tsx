'use client'

import { useState, useTransition } from 'react'
import { createPost, updatePost, deletePost, type PostCategory } from './actions'

interface Post {
  id: string
  title: string
  excerpt: string | null
  content: string
  category: string
  thumbnail_url: string | null
  slug: string
  is_published: boolean
  published_at: string | null
  created_at: string
}

const CATEGORIES: PostCategory[] = ['NOTICE', 'JOURNAL', 'STORY']

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  category: 'NOTICE' as PostCategory,
  thumbnail_url: '',
  slug: '',
  is_published: false,
  published_at: null as string | null,
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

export function PostsClient({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [editing, setEditing] = useState<Post | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [msg, setMsg] = useState('')

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
    setMsg('')
  }

  function openEdit(post: Post) {
    setEditing(post)
    setForm({
      title: post.title,
      excerpt: post.excerpt ?? '',
      content: post.content,
      category: post.category as PostCategory,
      thumbnail_url: post.thumbnail_url ?? '',
      slug: post.slug,
      is_published: post.is_published,
      published_at: post.published_at,
    })
    setShowForm(true)
    setMsg('')
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
    setMsg('')
  }

  function handleSave() {
    startTransition(async () => {
      try {
        if (editing) {
          const updated = await updatePost(editing.id, form) as unknown as Post
          setPosts(prev => prev.map(p => p.id === editing.id ? updated : p))
          setMsg('저장되었습니다')
        } else {
          const created = await createPost(form) as unknown as Post
          setPosts(prev => [created, ...prev])
          setMsg('등록되었습니다')
        }
        closeForm()
      } catch (e) {
        setMsg((e as Error).message)
      }
    })
  }

  function handleDelete(id: string) {
    if (!confirm('삭제하시겠습니까?')) return
    startTransition(async () => {
      await deletePost(id)
      setPosts(prev => prev.filter(p => p.id !== id))
    })
  }

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[18px] font-semibold text-[var(--color-ink)] tracking-[0.05em]">
          NOTICE 관리
        </h1>
        <button
          onClick={openNew}
          className="px-5 py-2.5 bg-[var(--color-espresso)] text-white text-[12px] tracking-[0.1em] hover:opacity-80 transition-opacity"
        >
          + 새 글 작성
        </button>
      </div>

      {msg && (
        <div className="mb-4 px-4 py-3 bg-[var(--color-stone)] text-[13px] text-[var(--color-body)]">
          {msg}
        </div>
      )}

      {/* 폼 */}
      {showForm && (
        <div className="mb-8 border border-[var(--color-hairline)] bg-white p-6">
          <h2 className="text-[14px] font-semibold mb-5 tracking-[0.05em]">
            {editing ? '글 수정' : '새 글 작성'}
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block text-[11px] tracking-[0.15em] mb-1.5 text-[var(--color-body)]">제목 *</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border border-[var(--color-hairline)] px-3 py-2.5 text-[14px] focus:outline-none focus:border-[var(--color-espresso)]"
                placeholder="글 제목"
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-[0.15em] mb-1.5 text-[var(--color-body)]">카테고리</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as PostCategory }))}
                className="w-full border border-[var(--color-hairline)] px-3 py-2.5 text-[14px] focus:outline-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] tracking-[0.15em] mb-1.5 text-[var(--color-body)]">슬러그 (URL)</label>
              <input
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                className="w-full border border-[var(--color-hairline)] px-3 py-2.5 text-[14px] focus:outline-none focus:border-[var(--color-espresso)]"
                placeholder="비우면 자동 생성"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] tracking-[0.15em] mb-1.5 text-[var(--color-body)]">요약 (선택)</label>
              <input
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                className="w-full border border-[var(--color-hairline)] px-3 py-2.5 text-[14px] focus:outline-none focus:border-[var(--color-espresso)]"
                placeholder="목록에 표시될 짧은 요약"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] tracking-[0.15em] mb-1.5 text-[var(--color-body)]">썸네일 URL (선택)</label>
              <input
                value={form.thumbnail_url}
                onChange={e => setForm(f => ({ ...f, thumbnail_url: e.target.value }))}
                className="w-full border border-[var(--color-hairline)] px-3 py-2.5 text-[14px] focus:outline-none focus:border-[var(--color-espresso)]"
                placeholder="https://..."
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] tracking-[0.15em] mb-1.5 text-[var(--color-body)]">본문 *</label>
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={12}
                className="w-full border border-[var(--color-hairline)] px-3 py-2.5 text-[14px] focus:outline-none focus:border-[var(--color-espresso)] resize-y font-mono"
                placeholder="본문 내용을 입력하세요"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_published"
                checked={form.is_published}
                onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="is_published" className="text-[13px] text-[var(--color-body)]">
                즉시 게시
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isPending || !form.title || !form.content}
              className="px-6 py-2.5 bg-[var(--color-espresso)] text-white text-[12px] tracking-[0.1em] hover:opacity-80 disabled:opacity-40 transition-opacity"
            >
              {isPending ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={closeForm}
              className="px-6 py-2.5 border border-[var(--color-hairline)] text-[12px] tracking-[0.1em] hover:bg-[var(--color-stone)] transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 목록 */}
      <div className="border border-[var(--color-hairline)] overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-[var(--color-stone)] border-b border-[var(--color-hairline)]">
              <th className="text-left px-4 py-3 text-[11px] tracking-[0.1em] font-semibold text-[var(--color-body)] w-[90px]">카테고리</th>
              <th className="text-left px-4 py-3 text-[11px] tracking-[0.1em] font-semibold text-[var(--color-body)]">제목</th>
              <th className="text-left px-4 py-3 text-[11px] tracking-[0.1em] font-semibold text-[var(--color-body)] w-[90px]">상태</th>
              <th className="text-left px-4 py-3 text-[11px] tracking-[0.1em] font-semibold text-[var(--color-body)] w-[110px]">날짜</th>
              <th className="px-4 py-3 w-[100px]" />
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[var(--color-body)] opacity-50">
                  아직 등록된 글이 없습니다
                </td>
              </tr>
            ) : (
              posts.map((post, i) => (
                <tr
                  key={post.id}
                  className={`border-b border-[var(--color-hairline)] ${i % 2 === 0 ? '' : 'bg-[var(--color-canvas)]'} hover:bg-[var(--color-stone)]/40 transition-colors`}
                >
                  <td className="px-4 py-3">
                    <span className="text-[10px] tracking-[0.15em] text-[var(--color-espresso)] font-semibold">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink)] font-medium">{post.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-[0.1em] px-2 py-0.5 ${
                      post.is_published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-[var(--color-stone)] text-[var(--color-body)]'
                    }`}>
                      {post.is_published ? '게시중' : '비공개'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-body)] opacity-70">
                    {formatDate(post.published_at ?? post.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEdit(post)}
                        className="text-[11px] tracking-[0.05em] text-[var(--color-espresso)] hover:opacity-60 transition-opacity"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-[11px] tracking-[0.05em] text-red-400 hover:opacity-60 transition-opacity"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
