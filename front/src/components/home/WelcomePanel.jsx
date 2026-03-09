import { NavLink } from 'react-router-dom'
import PostAddIcon from '@mui/icons-material/PostAdd'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { T } from '@src/i18n'
import useRoutes from '@src/routes'
import logo from '@static/icon_circle.png'
import './WelcomePanel.scoped.scss'

export default function WelcomePanel() {
  const { AddPostRoute } = useRoutes()
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
        to={AddPostRoute.path}
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
