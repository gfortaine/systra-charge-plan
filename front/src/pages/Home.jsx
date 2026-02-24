import WelcomePanel from '@comp/home/WelcomePanel'
import PostList from '@comp/PostList'

export default function Home() {
  return (
    <div className="view">
      <WelcomePanel />
      <PostList />
    </div>
  )
}
