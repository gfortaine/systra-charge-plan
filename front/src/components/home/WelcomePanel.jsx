import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import logo from '@static/icon_circle.png'
import PostAddIcon from '@mui/icons-material/PostAdd'
import { NavLink } from 'react-router-dom'
import { T } from '@src/utils/i18n'

export default function WelcomePanel() {
  return (
    <Paper className="welcome-panel" elevation="5">
      <div className="welcome-subtitle">
        <T>Welcome to</T>
      </div>
      <div className="welcome-title">
        Myapp
      </div>
      <p className="welcome-text">
        <T>Select a blog post in the list, or create a new one!</T>
      </p>
      <Button
        component={NavLink}
        to="/add-post"
        variant="contained"
        startIcon={<PostAddIcon />}
        className="welcome-btn"
        color="primary"
      >
        <T>Create a new blog post</T>
      </Button>
      <img
        src={logo}
        alt="logo"
        className="welcome-icon"
      />
    </Paper>
  )
}
