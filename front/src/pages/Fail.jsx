import logo from '@static/logo-v2-dark.png'
import {
  Card,
  CardContent,
  Container,
} from '@mui/material'

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
