import {
  Card,
  CardContent,
  Container,
} from '@mui/material'
import { T } from '@src/utils/i18n'
import { useAuthContext } from '@src/utils/auth'

export default function User() {
  const { user } = useAuthContext()
  return (
    <Container className="view">
      <Card>
        <CardContent>
          <T one="Hello {{ fullName }} ({{ email }})!" fullName={user.fullName} email={user.email} />
        </CardContent>
      </Card>
    </Container>
  )
}
