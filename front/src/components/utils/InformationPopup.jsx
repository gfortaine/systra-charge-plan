import { useRef, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'
import SubmitIcon from '@mui/icons-material/Done'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { ValidationContext } from './ValidationContext'

export default function InformationPopup({
  open,
  title,
  buttons, /* [{type: button | submit | cancel, label, params: [...], icon, color}, ...] */
  children,
  onCancel = () => {},
  onButton = (_button, ..._params) => {},
  onSubmit = () => {},
}) {
  const [isValid, setIsValid] = useState(true)
  const validMap = useRef({})
  function isButtonDisabled(button) {
    return button.type === 'submit' && !isValid
  }
  function getButtonType(button) {
    if (button.type == 'submit') {
      return 'submit'
    } else {
      return 'button'
    }
  }
  function getButtonColor(button) {
    let color = button.color
    if (!color) {
      if (button.type === 'cancel') {
        color = 'secondary'
      } else if (button.type === 'submit') {
        color = 'primary'
      }
    }
    return color
  }
  function getButtonIcon(button) {
    let icon = button.icon
    if (!icon) {
      if (button.type === 'cancel') {
        icon = <CancelIcon />
      } else if (button.type === 'submit') {
        icon = <SubmitIcon />
      }
    }
    return icon
  }
  function onDialogClose() {
    onCancel()
  }
  function onButtonClick(button) {
    if (button.type == 'cancel') {
      onCancel()
    } else if (button.type != 'submit') {
      onButton(button, ...button.params || [])
    } else {
      if (isValid) {
        onSubmit()
      }
    }
  }
  return (
    <ValidationContext.Provider
      value={{
        setValid: (name, isValid) => {
          validMap.current[name] = isValid
          setIsValid(Object.values(validMap.current).every(valid => valid))
        },
      }}
    >
      <Dialog onClose={onDialogClose} open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (isValid) {
                onSubmit()
              }
            }}
          >
            {children}
          </form>
        </DialogContent>
        <DialogActions>
          {buttons.map(btn => (
            <Button
              key={btn.label}
              type={getButtonType(btn)}
              variant="contained"
              className="button"
              color={getButtonColor(btn)}
              disabled={isButtonDisabled(btn)}
              startIcon={getButtonIcon(btn)}
              onClick={() => onButtonClick(btn)}
            >
              {btn.label}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    </ValidationContext.Provider>
  )
}
