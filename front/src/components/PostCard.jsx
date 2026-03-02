export default function PostCard({
  item,
  onEnterPost = () => {},
  onDeletePost = () => {},
}) {
  onEnterPost
  onDeletePost
  return (
    <div>A post {item.id} {item.title} ({item.author.fullName})</div>
  )
}
