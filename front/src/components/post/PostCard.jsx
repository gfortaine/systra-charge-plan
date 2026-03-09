import { useState } from 'react'
import EnterIcon from '@mui/icons-material/ArrowRight'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, Chip, Stack } from '@mui/material'
import InformationPopup from '@comp/utils/InformationPopup'
import { T, useI18n } from '@src/i18n'
import './PostCard.scoped.scss'

export default function PostCard({
  post,
  onEnterPost = () => {},
  onDeletePost = () => {},
}) {
  const { t } = useI18n()
  const categoryNames = post.categories?.map(cat => cat.name) ?? []
  const authorName = post.author?.fullName ?? ''
  const publicationDate = new Date(post.pubdate)
  const $language = { current: 'fr' }
  const localeDate = publicationDate.toLocaleDateString($language.current)
  const localeTime = publicationDate.toLocaleTimeString($language.current)
  const [deletePostDialogShown, setDeletePostDialogShown] = useState(false)
  const deletePostDialogButtons = [
    {
      type: 'cancel',
      label: t('Cancel'),
    },
    {
      type: 'submit',
      label: t('Confirm'),
      icon: (<DeleteIcon />),
      color: 'error',
    },
  ]
  function showDeletePostDialog() {
    setDeletePostDialogShown(true)
  }
  function hideDeletePostDialog() {
    setDeletePostDialogShown(false)
  }
  function deletePost() {
    hideDeletePostDialog()
    onDeletePost(post)
  }
  function enterPost() {
    onEnterPost(post)
  }
  return (
    <div className="post">
      <div className="header">
        <div className="title">{ post.title }</div>
        { categoryNames.length && (
          <Stack className="categories" direction="row" spacing={1}>
            {categoryNames.forEach(category => { (
              <Chip key="category" label={category} />
            ) })}
          </Stack>
        )}
      </div>
      <div className="author-date">
        <T
          one="Published by {{ authorName }} on {{ localeDate }} at {{ localeTime }}"
          authorName={<span className="author">{ authorName }</span>}
          localeDate={localeDate}
          localeTime={localeTime}
        />
      </div>
      <div className="actions">
        <Button
          variant="outlined"
          size="large"
          color="error"
          startIcon={(<DeleteIcon />)}
          onClick={showDeletePostDialog}
        >
          <T>Delete</T>
        </Button>
        <Button
          variant="contained"
          size="large"
          color="primary"
          startIcon={(<EnterIcon />)}
          onClick={enterPost}
        >
          <T>Open</T>
        </Button>
      </div>
      <InformationPopup
        open={deletePostDialogShown}
        title={t('Delete a blog post')}
        buttons={deletePostDialogButtons}
        onCancel={hideDeletePostDialog}
        onSubmit={deletePost}
      >
        <div>
          <T
            one="You are about to delete the blog post « {{ post }} ». Do you really want to take that action?"
            post={post.title}
          />
        </div>
      </InformationPopup>
    </div>
  )
}
