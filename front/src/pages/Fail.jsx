import {
  Card,
  CardContent,
  Container,
} from '@mui/material'
import logo from '@static/logo-v2-dark.png'

export default function Fail() {
  return (
    <Container>
      <Card>
        <CardContent>
          <img src={logo} className="react-logo" alt="Myapp" />
          Error
        </CardContent>
      </Card>
    </Container>
  )
}
