import { getAllPostsAdmin } from './actions'
import { PostsClient } from './PostsClient'

export default async function AdminPostsPage() {
  const posts = await getAllPostsAdmin()
  return <PostsClient initialPosts={posts as Parameters<typeof PostsClient>[0]['initialPosts']} />
}
