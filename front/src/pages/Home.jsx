import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import logo from '@static/logo.svg'
import PostAddIcon from '@mui/icons-material/PostAdd'

export default function Home() {
  return (
    <div className="home">
      <Paper elevation="5">
        <div>
          Welcome to
        </div>
        <div>
          Myapp
        </div>
        <p>
          Select a blog post in the list, or create a new one!
        </p>
        <Button
          variant="contained"
          startIcon={<PostAddIcon />}
          component="a"
          href="/add-post"
        >
          Create a new blog post
        </Button>
        <img src={logo} className="react-logo" alt="logo" />
      </Paper>
      <Paper elevation="5">
        TEST
      </Paper>
    </div>
  )
}
