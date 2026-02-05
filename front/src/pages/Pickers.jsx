import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { Card, CardContent } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker'

export default function Pickers() {
  return (
    <div className="pickers">
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Card>
          <CardContent>
            <DatePicker />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <TimePicker label="Basic time picker" />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <StaticTimePicker />
          </CardContent>
        </Card>
      </LocalizationProvider>
    </div>
  )
}
