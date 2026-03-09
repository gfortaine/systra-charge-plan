import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Cancel,
  Save,
} from '@mui/icons-material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import {
  Box,
  Button,
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
import TextField from '@mui/material/TextField'
import useGraphql from '@src/graphql'
import { createPostMutation } from '@src/graphql/mutations'
import { getAllUsersAndCategoriesQuery } from '@src/graphql/queries'
import { T, useI18n } from '@src/i18n'
import useRoutes from '@src/routes'
import './AddPost.scoped.scss'

export default function AddPost() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { HomeRoute } = useRoutes()
  const { graphqlQuery, graphqlMutate } = useGraphql()
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const fetchData = useCallback(async (setUsers, setCategories) => {
    try {
      const { allUsers, allCategories } = await graphqlQuery(getAllUsersAndCategoriesQuery)
      setUsers(allUsers)
      setCategories(allCategories)
    } catch (err) {
      console.error(err)
    }
  }, [graphqlQuery])
  useEffect(() => {
    fetchData(setUsers, setCategories)
  }, [fetchData])
  const addPost = useCallback(async (data) => {
    const variables = {
      ...data,
      author: { id: data.author }, // data.author is an id
    }
    try {
      await graphqlMutate(createPostMutation, variables)
      navigate({ pathname: HomeRoute.path })
    } catch (err) {
      console.error(err)
    }
  }, [graphqlMutate, navigate, HomeRoute])

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      author: '',
      categories: [],
      text: '',
      language: '',
    },
  })
  const titleRules = {
    validate: value => (value.length > 3) || t('Title must be, at least, 3 characters long.'),
  }
  const authorRules = { required: t('You must select an author.') }
  const languageRules = { required: t('You must chose a language.') }
  const onSubmit = async (data) => {
    await addPost(data)
  }

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
                rules={titleRules}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    label={t('Title')}
                  />
                )}
              />
              <FormHelperText className="error-msg">{errors.title?.message}</FormHelperText>
            </FormControl>
            <FormControl>
              <Controller
                name="author"
                control={control}
                rules={authorRules}
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
                      {users.map(user => (
                        <MenuItem
                          key={user.id}
                          value={user.id}
                        >
                          {user.fullName}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              />
              <FormHelperText className="error-msg">{errors.author?.message}</FormHelperText>
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
                      input={<OutlinedInput id="select-multiple-chip" label={t('Categories')} />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map(cat_id => (
                            <Chip key={cat_id} label={categories.find(cat => cat.id == cat_id).name} />
                          ))}
                        </Box>
                      )}
                    >
                      {categories.map(category => {
                        const selected = field.value.includes(category.id)
                        const SelectionIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon
                        return (
                          <MenuItem key={category.id} value={category.id}>
                            <SelectionIcon
                              fontSize="small"
                              style={{ marginRight: 8, padding: 9, boxSizing: 'content-box' }}
                            />
                            <ListItemText primary={category.name} />
                          </MenuItem>
                        )
                      })}
                    </Select>
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
                rules={languageRules}
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
              <FormHelperText className="error-msg">{errors.language?.message}</FormHelperText>
            </FormControl>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              component={NavLink}
              to={HomeRoute.path}
              variant="contained"
              color="secondary"
              startIcon={<Cancel />}
            >
              <T>Cancel</T>
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              type="submit"
              color="primary"
            >
              <T>Publish</T>
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  )
}
