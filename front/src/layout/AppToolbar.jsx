import { NavLink } from 'react-router-dom'
import { AccountCircle } from '@mui/icons-material'
import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { languages, useI18n } from '@src/i18n'
import useRoutes from '@src/routes'
import app_logo from '@static/logo-v2-dark.png'
import './AppToolbar.scoped.scss'

const MyAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer - 200,
  width: '100%',
  paddingLeft: '64px',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}))

export default function AppToolbar() {
  const { UserRoute } = useRoutes()
  const { locale: currentLocale, setLocale } = useI18n()

  return (
    <MyAppBar position="fixed" className="app-toolbar">
      <Toolbar>
        <img src={app_logo} className="app-logo" alt="logo" />
        <Typography variant="h6" component="div" className="project-name">
          MyApp
        </Typography>
        <Stack direction="row">
          {Object.entries(languages).map(([locale, title]) => (
            <Button
              key={locale}
              variant={locale === currentLocale ? 'contained' : 'text'}
              title={title}
              onClick={() => setLocale(locale)}
            >
              {locale}
            </Button>
          ))}
          <IconButton
            component={NavLink}
            to={UserRoute.path}
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="secondary"
          >
            <AccountCircle />
          </IconButton>
        </Stack>
      </Toolbar>
    </MyAppBar>
  )
}
