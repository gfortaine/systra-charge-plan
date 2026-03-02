import PostList from '@comp/PostList'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import logo from '@static/logo.svg'
import PostAddIcon from '@mui/icons-material/PostAdd'
import { NavLink } from 'react-router-dom'
import { T } from '@src/lioness'

export default function Home() {
  return (
    <div className="view">
      <Paper elevation="5">
        <div>
          <T>Welcome to</T>
        </div>
        <div>
          Myapp
        </div>
        <p>
          <T>Select a blog post in the list, or create a new one!</T>
        </p>
        <Button
          variant="contained"
          startIcon={<PostAddIcon />}
          component={NavLink}
          to="/add-post"
        >
          <T>Create a new blog post</T>
        </Button>
        <div>
          <img src={logo} className="react-logo" alt="logo" />
        </div>
      </Paper>
      <Paper elevation="5">
        <PostList />
      </Paper>
    </div>
  )
}
