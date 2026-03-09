import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  TextField,
  Autocomplete,
} from '@mui/material'
import { useValidation } from '@comp/utils/ValidationContext'
import useGraphql from '@src/graphql'
import { getAllUsersQuery } from '@src/graphql/queries'
import { useI18n } from '@src/i18n'

export default function CommentForm({
  comment = {},
  onChange = _comment => {},
}) {
  const { setValid } = useValidation()
  const { t } = useI18n()
  const { graphqlQuery } = useGraphql()
  const [availUsers, setAvailUsers] = useState([])
  useEffect(() => {
    async function fetchUsers () {
      try {
        const { allUsers } = await graphqlQuery(getAllUsersQuery)
        setAvailUsers(allUsers)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUsers()
  }, [graphqlQuery])
  const [formData, setFormData] = useState({
    text: comment?.text ?? '',
    author: comment?.author ?? null,
  })
  useEffect(() => {
    onChange(formData)
  }, [formData]) // eslint-disable-line react-hooks/exhaustive-deps
  const validate = useCallback((formData) => {
    return !!formData.text && !!formData.author
  }, [])
  useEffect(() => {
    setValid('commentForm', validate(formData))
  }, [setValid, validate, formData])
  function handleTextChange(e) {
    setFormData(prev => ({ ...prev, text: e.target.value }))
  }
  function handleAuthorChange(e, value) {
    setFormData(prev => ({ ...prev, author: value }))
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        multiline
        minRows={3}
        variant="standard"
        label={t('Comment')}
        value={formData.text}
        onChange={handleTextChange}
        required
        helperText={!formData.text && t('Comment is required')}
      />
      <Autocomplete
        options={availUsers}
        getOptionLabel={opt => opt.fullName}
        value={formData.author}
        onChange={handleAuthorChange}
        renderInput={params => (
          <TextField
            {...params}
            label={t('Author')}
            variant="standard"
            required
            helperText={!formData.author && t('Author is required')}
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
    </Box>
  )
}
