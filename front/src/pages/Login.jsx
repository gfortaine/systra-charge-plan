import {
  Box,
  Button,
} from '@mui/material'
import { useAuth } from '@src/utils/auth'
import { T } from '@src/utils/i18n'

export default function Login() {
  const { login } = useAuth()
  function handleLogin() {
    login()
  }
  return (
    <Box>
      <Box>Not authed</Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
      >
        <T>Login</T>
      </Button>
    </Box>
  )
}
