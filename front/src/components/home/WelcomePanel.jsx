import { NavLink } from 'react-router-dom'
import { Trans } from '@lingui/react/macro'
import PostAddIcon from '@mui/icons-material/PostAdd'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import useRoutes from '@src/routes'
import logo from '@static/icon_circle.png'
import './WelcomePanel.scoped.scss'

export default function WelcomePanel() {
  const { AddPostRoute } = useRoutes()
  return (
    <Paper className="welcome-panel" elevation={5}>
      <div className="welcome-subtitle">
        <Trans>Welcome to</Trans>
      </div>
      <div className="welcome-title">
        Myapp
      </div>
      <p className="welcome-text">
        <Trans>Select a blog post in the list, or create a new one!</Trans>
      </p>
      <Button
        component={NavLink}
        to={AddPostRoute.path}
        variant="contained"
        startIcon={<PostAddIcon />}
        className="welcome-btn"
        color="primary"
      >
        <Trans>Create a new blog post</Trans>
      </Button>
      <img
        src={logo}
        alt="logo"
        className="welcome-icon"
      />
    </Paper>
  )
}
