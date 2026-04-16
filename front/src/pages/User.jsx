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
  const fullName = user?.fullName ?? 'Unknown'
  const email = user?.email ?? ''
  return (
    <Container className="view">
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography variant="h4">
            <Trans>Hello {fullName} ({email})!</Trans>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}
