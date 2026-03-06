import TextField from '@mui/material/TextField'
import {
  Button,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
} from '@mui/material'
import {
  Cancel,
  Save,
} from '@mui/icons-material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { useForm, Controller } from 'react-hook-form'
import { NavLink } from 'react-router-dom'
import { T, useI18n } from '@src/utils/i18n'
import './AddPost.scoped.scss'

export default function AddPost() {
  const { t } = useI18n()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      author: '',
      categories: [],
      text: '',
      language: '',
    },
  })

  const onSubmit = (data) => {
    console.log({ data })
    if (data.title.length < 3) {
      alert('Title must be, at least, 3 characters long.')
    }
  }

  const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ]

  const categories = [
    'Travel',
    'Arts',
    'News',
  ]

  return (
    <div className="view">
      <Card className="add-post-card">
        <CardHeader title={t('Add a post')} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="form-content">
            <FormControl>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label={t('Title')}
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="author"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel id="author-label">
                      <T>Author</T>
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="author-label"
                      label={t('Author')}
                    >
                      {names.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="categories"
                control={control}
                defaultValue={[]} // important to prevent undefined
                render={({ field }) => (
                  <>
                    <InputLabel id="categories-label">
                      <T>Categories</T>
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="categories-label"
                      label={t('Categories')}
                      multiple
                      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {categories.map(category => {
                        const selected = field.value.includes(category)
                        const SelectionIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon
                        return (
                          <MenuItem key={category} value={category}>
                            <SelectionIcon
                              fontSize="small"
                              style={{ marginRight: 8, padding: 9, boxSizing: 'content-box' }}
                            />
                            <ListItemText primary={category} />
                          </MenuItem>
                        )
                      })}
                    </Select>
                    <FormHelperText>
                      <T>You can select several categories.</T>
                    </FormHelperText>
                  </>
                )}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="text"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    id="text-field"
                    label={t('Text')}
                    multiline
                    rows={5}
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <Controller
                name="language"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <FormLabel id="language-radio-label">
                      <T>Language</T>
                    </FormLabel>
                    <RadioGroup
                      {...field}
                      name="language"
                      aria-labelledby="language-radio-label"
                    >
                      <FormControlLabel value="english" control={<Radio />} label={t('English')} />
                      <FormControlLabel value="french" control={<Radio />} label={t('French')} />
                      <FormControlLabel value="other" control={<Radio />} label={t('Other')} />
                    </RadioGroup>
                  </>
                )}
              />
            </FormControl>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              startIcon={<Save />}
              type="submit"
              color="primary"
            >
              <T>Publish</T>
            </Button>
            <Button
              component={NavLink}
              to="/"
              variant="contained"
              color="secondary"
              startIcon={<Cancel />}
            >
              <T>Cancel</T>
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  )
}
