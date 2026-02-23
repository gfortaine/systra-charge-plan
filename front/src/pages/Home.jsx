import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import logo from '@static/logo.svg'
import PostAddIcon from '@mui/icons-material/PostAdd'
import { NavLink } from 'react-router-dom'
import { T } from 'lioness'

export default function Home() {
  return (
    <div className="view">
      <Paper elevation="5">
        <div>
          Welcome to
        </div>
        <div>
          Myapp
        </div>
        <p>
          <T>Select a blog post in the list, or create a new one!</T>
        </p>
        <NavLink to="/add-post">
        <Button
          variant="contained"
          startIcon={<PostAddIcon />}
          component="a"
        >
          Create a new blog post
        </Button>
        </NavLink>
        <div>
        <img src={logo} className="react-logo" alt="logo" />
        </div>
      </Paper>
      <Paper elevation="5">
        TEST
      </Paper>
    </div>
  )
}
