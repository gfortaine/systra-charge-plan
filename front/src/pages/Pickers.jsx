import { Trans } from '@lingui/react/macro'
import { Alert, Paper } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
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
        <Paper>
          <Alert severity="warning" onClose={() => {}}>
            <Trans>This Alert displays the default close icon.</Trans>
          </Alert>
        </Paper>
      </LocalizationProvider>
    </div>
  )
}
