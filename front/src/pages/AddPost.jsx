import TextField from '@mui/material/TextField'
import {
  Card,
  CardContent,
  MenuItem,
  Select,
  CardActions,
  Button,
  CardHeader,
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import SaveIcon from '@mui/icons-material/Save'
import { useForm, Controller } from 'react-hook-form'

export default function AddPost() {
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
    <Card>
      <CardHeader title="Add a post" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
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
              <Select
                {...field}
                label="Author"
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
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            type="submit"
          >
            Publish
          </Button>
          <Button
            variant="contained"
            startIcon={<CancelIcon />}
            href="/"
          >
            Cancel
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}
