import {
  Delete,
  Edit,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Typography,
} from '@mui/material'
import { T, useI18n } from '@src/i18n'

export default function Comment({
  comment,
  onEditComment = () => {},
  onDeleteComment = () => {},
}) {
  const { locale } = useI18n()
  const text = comment.text ?? ''
  const authorName = comment.author?.fullName ?? ''
  const commentDate = comment.date ? new Date(comment.date) : null
  const dateString = commentDate?.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })
  const timeString = commentDate?.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  const dateAsString = dateString && timeString ? `${dateString} @ ${timeString}` : ''
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
          <span>{dateAsString}</span>
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
          <T>Edit</T>
        </Button>
        <Button
          startIcon={<Delete />}
          color="error"
          onClick={onDeleteComment}
          size="small"
          variant="outlined"
        >
          <T>Delete</T>
        </Button>
      </Box>
    </Box>
  )
}
