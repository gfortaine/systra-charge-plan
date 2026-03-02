import TextField from '@mui/material/TextField'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import SaveIcon from '@mui/icons-material/Save'
import { useForm, Controller } from 'react-hook-form'
import { NavLink } from 'react-router-dom'
import { T } from '@src/lioness'
import './AddPost.css'
import { useTranslation } from '@src/lioness'

export default function AddPost() {
  const { t } = useTranslation()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      author: '',
      categories: [],
    },
  })
  const onSubmit = (data) => console.log(data)

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
    <Container>
      <Card>
        <CardHeader title={t('Add a post')} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <FormControl>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                  />
                )}
              />
              <Controller
                name="author"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel>Author</InputLabel>
                    <Select
                      label="Author"
                      {...field}
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
              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Categories"
                    multiple
                  >
                    {categories.map((category) => (
                      <MenuItem
                        key={category}
                        value={category}
                      >
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              type="submit"
            >
              <T>Publish</T>
            </Button>
            <NavLink to="/">
              <Button
                variant="contained"
                startIcon={<CancelIcon />}
              >
                <T>Cancel</T>
              </Button>
            </NavLink>
          </CardActions>
        </form>
      </Card>
    </Container>
  )
}
