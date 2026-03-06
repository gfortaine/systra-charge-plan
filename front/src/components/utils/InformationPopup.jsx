import { useState, createContext, useContext } from 'react'
import { T, useI18n } from '@src/utils/i18n'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { Button, Card, CardActions, CardContent, CardHeader } from '@mui/material'
import './InformationPopup.scoped.scss'

const FormValidityContext = createContext({
  isValid: true,
  setValidity: () => {},
})
const FormValidityProvider = ({ children }) => {
  const [validMap, setValidMap] = useState({})
  const setValidity = (id, isValid) => {
    setValidMap(map => ({ ...map, [id]: isValid }))
  }
  const isValid = Object.values(validMap).every(v => !!v)
  return (<FormValidityContext.Provider value={{ isValid, setValidity }}>{children}</FormValidityContext.Provider>)
}
const useFormValidity = () => useContext(FormValidityContext)
function InformationPopup({
  open,
  title,
  buttons, /* [{type: button | submit | cancel, label, params: [...], icon, color, class}, ...] */
  children,
  onCancel = () => {},
  onButton = (_button, ..._params) => {},
  onSubmit = (_isValid, ..._params) => {},
}) {
  const { t } = useI18n()
  const { isValid } = useFormValidity()
  function isButtonDisabled(button) {
    return button.type === 'submit' && !isValid
  }
  function onDialogClose() {
    onCancel()
  }
  function onButtonClick(button) {
    if (button.type == 'cancel') {
      onCancel()
    } else if (button.type != 'submit') {
      onButton(button, ...button.params || [])
    }
  }
  function handleSubmitForm() {
    const button = buttons.find(btn => btn.type === 'submit') || {}
    onSubmit(isValid, ...button.params || [])
  }
  return (
    <Dialog onClose={onDialogClose} open={open}>
      <DialogTitle>
        <T>{title}</T>
      </DialogTitle>
      <Card>
        <CardHeader className="header" title={t(title)} />
        <form onSubmit={handleSubmitForm}>
          <CardContent className="text">
            <FormValidityProvider>
              {children}
            </FormValidityProvider>
          </CardContent>
          <CardActions className="actions">
            {buttons.map(btn => (
              <Button
                key={btn.label}
                type={['submit'].find(v => v == btn.type) || 'button'} // button or submit
                variant="contained"
                className="button"
                color={btn.color}
                disabled={isButtonDisabled(btn)}
                startIcon={btn.icon}
                onClick={() => onButtonClick(btn)}
              >
                <T>{btn.label}</T>
              </Button>
            ))}
          </CardActions>
        </form>
      </Card>
    </Dialog>
  )
}

InformationPopup.useFormValidity
export default InformationPopup
