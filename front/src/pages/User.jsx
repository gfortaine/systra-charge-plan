import {
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material'
import { T } from '@src/utils/i18n'
import { useAuth } from '@src/utils/auth'

export default function User() {
  const { user } = useAuth()
  return (
    <Container className="view">
      <Card>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography variant="h4">
            <T one="Hello {{ fullName }} ({{ email }})!" fullName={user.fullName} email={user.email} />
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}
