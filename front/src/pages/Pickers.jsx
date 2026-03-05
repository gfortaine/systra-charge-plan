import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { Paper } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker'
import './Pickers.scoped.scss'

export default function Pickers() {
  return (
    <div className="view">
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Paper className="pickers-paper">
          <DatePicker />
          <TimePicker label="Basic time picker" />
        </Paper>
        <Paper className="pickers-paper">
          <StaticTimePicker />
        </Paper>
      </LocalizationProvider>
    </div>
  )
}
