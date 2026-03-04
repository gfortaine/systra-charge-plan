import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { Card, CardContent } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker'

export default function Pickers() {
  return (
    <div className="view">
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Card className="pickers-card">
          <CardContent>
            <DatePicker />
            <TimePicker label="Basic time picker" />
          </CardContent>
        </Card>
        <Card className="pickers-card">
          <CardContent>
            <StaticTimePicker />
          </CardContent>
        </Card>
      </LocalizationProvider>
    </div>
  )
}
