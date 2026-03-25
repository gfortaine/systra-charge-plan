import { Trans } from '@lingui/react/macro'
import {
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material'
import { useAuth } from '@src/auth'

export default function User() {
  const { user } = useAuth()
  return (
    <Container className="view">
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography variant="h4">
            <Trans>Hello {user.fullName} ({user.email})!</Trans>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}
