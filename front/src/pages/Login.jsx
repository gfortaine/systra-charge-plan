import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
} from '@mui/material'
import { useAuth } from '@src/auth'
import { T, useI18n } from '@src/i18n'
import logo from '@static/icon_circle.png'
import './Login.scoped.scss'

export default function Login() {
  const { login } = useAuth()
  const { t } = useI18n()

  return (
    <div className="view">
      <Container className="login-container">
        <Card elevation="5" className="login-card">
          <CardHeader
            title={t('Login')}
          />
          <img
            src={logo}
            alt="logo"
            height="160"
          />
          <CardContent>
            <T>You must be logged in to have access to this application. Please click on the button below to do so.</T>
          </CardContent>
          <CardActions className="login-actions">
            <Button
              variant="contained"
              color="primary"
              onClick={login}
            >
              <T>Login</T>
            </Button>
          </CardActions>
        </Card>
      </Container>
    </div>
  )
}
