import { useMemo } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import {
  Delete,
  Edit,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Typography,
} from '@mui/material'

export default function Comment({
  comment,
  onEditComment = () => {},
  onDeleteComment = () => {},
}) {
  const { i18n } = useLingui()
  const text = comment.text ?? ''
  const authorName = comment.author?.fullName ?? ''
  const commentDate = useMemo(() => {
    if (!comment.date) {
      return ''
    }
    const date = new Date(comment.date)
    const dateString = i18n.date(date, { day: '2-digit', month: '2-digit', year: 'numeric' })
    const timeString = i18n.date(date, { hour: '2-digit', minute: '2-digit' })
    return `${dateString} @ ${timeString}`
  }, [comment.date, i18n])

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2, border: '1px solid #ddd' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">
          By
          {' '}
          <span>{authorName}</span>
          {' '}
          on
          {' '}
          <span>{commentDate}</span>
        </Typography>
        <Typography>{text}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          startIcon={<Edit />}
          color="secondary"
          onClick={onEditComment}
          size="small"
          variant="outlined"
        >
          <Trans>Edit</Trans>
        </Button>
        <Button
          startIcon={<Delete />}
          color="error"
          onClick={onDeleteComment}
          size="small"
          variant="outlined"
        >
          <Trans>Delete</Trans>
        </Button>
      </Box>
    </Box>
  )
}
