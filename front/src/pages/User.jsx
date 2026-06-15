import { Trans } from '@lingui/react/macro'
import {
  Card,
  CardContent,
  Typography,
} from '@mui/material'
import { useAuth } from '@src/auth'

export default function User() {
  const { user } = useAuth()
  const fullName = user?.fullName ?? 'Unknown'
  const email = user?.email ?? ''
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h4">
          <Trans>Hello {fullName} ({email})!</Trans>
        </Typography>
      </CardContent>
    </Card>
  )
}
