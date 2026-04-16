import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import { Trans, useLingui } from '@lingui/react/macro'
import {
  Cancel,
  CheckBox,
  CheckBoxOutlineBlank,
  Close,
  Save,
} from '@mui/icons-material'
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
  TextField,
} from '@mui/material'
import { MuiFileInput } from 'mui-file-input'
import useGraphql from '@src/graphql'
import allUsersAndCategoriesQuery from '@src/graphql/AllUsersAndCategories.query.graphql'
import createPostMutation from '@src/graphql/CreatePost.mutation.graphql'
import useRoutes from '@src/routes'
import './AddPost.scoped.scss'

export default function AddPost() {
  const { t } = useLingui()
  const navigate = useNavigate()
  const { HomeRoute } = useRoutes()
  const { graphqlQuery, graphqlMutate } = useGraphql()
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [imageUrl, setImageUrl] = useState(null)
  const fetchData = useCallback(async (setUsers, setCategories) => {
    try {
      const { allUsers, allCategories } = await graphqlQuery(allUsersAndCategoriesQuery)
      setUsers(allUsers)
      setCategories(allCategories)
    } catch (err) {
      console.error(err)
    }
  }, [graphqlQuery])
  useEffect(() => {
    fetchData(setUsers, setCategories)
  }, [fetchData])
  // https://react-hook-form.com/docs/useform
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      title: '',
      author: '',
      categories: [],
      imageFile: undefined,
      text: '',
      language: '',
    },
  })
  // https://react-hook-form.com/docs/useform/register#options
  const titleRules = {
    minLength: { value: 3, message: t`Title must be, at least, 3 characters long.` },
    maxLength: { value: 100, message: t`Title cannot excess 100 characters.` },
  }
  const authorRules = { required: t`You must select an author.` }
  const imageRules = {
    validate: files => {
      if (!files || !files.length) {
        return true
      }
      const file = files[0]
      const MB = 1 << 20
      const maxSizeMb = 2
      const maxSize = maxSizeMb * MB
      if (file.size > maxSize) {
        return t`Files size should be less than ${maxSizeMb}MB`
      }
    },
  }
  const languageRules = { required: t`You must chose a language.` }
  async function onImageChanged(file) {
    if (file) {
      await new Promise(resolve => {
        const imgReader = new FileReader()
        imgReader.onload = e => {
          setImageUrl(e.target.result)
          resolve()
        }
        imgReader.readAsDataURL(file)
      })
    } else {
      setImageUrl(null)
    }
  }
  async function onSubmit(data) {
    await addPost(data)
  }
  const addPost = useCallback(async (data) => {
    const authorId = data.author
    const variables = {
      title: data.title,
      text: data.text,
      author: { id: authorId },
      categories: data.categories,
    }
    if (data.imageFile) {
      variables.image = data.imageFile
    }
    try {
      await graphqlMutate(createPostMutation, variables)
      navigate({ pathname: HomeRoute.path })
    } catch (err) {
      console.error(err)
    }
  }, [graphqlMutate, navigate, HomeRoute])

  return (
    <div className="view">
      <Card className="add-post-card">
        <CardHeader title={t`Add a post`} />
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
                    inputProps={{ maxLength: 100 }}
                    label={t`Title`}
                    required
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
                      <Trans>Author</Trans>
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="author-label"
                      label={t`Author`}
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
                      <Trans>Categories</Trans>
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="categories-label"
                      label={t`Categories`}
                      multiple
                      input={<OutlinedInput id="select-multiple-chip" label={t`Categories`} />}
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
                        const SelectionIcon = selected ? CheckBox : CheckBoxOutlineBlank
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
                name="imageFile"
                control={control}
                rules={imageRules}
                render={({ field }) => (
                  <MuiFileInput
                    {...field}
                    label={t`Optional image`}
                    inputProps={{ accept: 'image/*' }}
                    clearIconButtonProps={{
                      title: t`Remove image`,
                      children: <Close fontSize="small" />,
                    }}
                    onChange={e => {
                      field.onChange(e) // forward to RHF
                      onImageChanged(e)
                    }}
                  />
                )}
              />
              <FormHelperText className="error-msg">{errors.imageFile?.message}</FormHelperText>
              {imageUrl && (
                <Box component="img" src={imageUrl} alt="preview" sx={{ ml: 2, maxWidth: 200, maxHeight: 200 }} />
              )}
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
                    label={t`Text`}
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
                      <Trans>Language</Trans>
                    </FormLabel>
                    <RadioGroup
                      {...field}
                      name="language"
                      aria-labelledby="language-radio-label"
                    >
                      <FormControlLabel value="english" control={<Radio />} label={t`English`} />
                      <FormControlLabel value="french" control={<Radio />} label={t`French`} />
                      <FormControlLabel value="other" control={<Radio />} label={t`Other`} />
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
              <Trans>Cancel</Trans>
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              type="submit"
              color="primary"
              disabled={!isValid}
            >
              <Trans>Publish</Trans>
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  )
}
