import { useState } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import EnterIcon from '@mui/icons-material/ArrowRight'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, Chip, Stack } from '@mui/material'
import InformationPopup from '@comp/utils/InformationPopup'
import './PostCard.scoped.scss'

export default function PostCard({
  post,
  onEnterPost = () => {},
  onDeletePost = () => {},
}) {
  const { t } = useLingui()
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
      label: t`Cancel`,
    },
    {
      type: 'submit',
      label: t`Confirm`,
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
            {categoryNames.map(category => { (
              <Chip key="category" label={category} />
            ) })}
          </Stack>
        )}
      </div>
      <div className="author-date">
        <Trans>
          Published by
          {' '}
          <span className="author">{ authorName }</span>
          {' '}
          on
          {' '}
          { localeDate }
          {' '}
          at
          {' '}
          { localeTime }
        </Trans>
      </div>
      <div className="actions">
        <Button
          variant="outlined"
          size="large"
          color="error"
          startIcon={(<DeleteIcon />)}
          onClick={showDeletePostDialog}
        >
          <Trans>Delete</Trans>
        </Button>
        <Button
          variant="contained"
          size="large"
          color="primary"
          startIcon={(<EnterIcon />)}
          onClick={enterPost}
        >
          <Trans>Open</Trans>
        </Button>
      </div>
      <InformationPopup
        open={deletePostDialogShown}
        title={t`Delete a blog post`}
        buttons={deletePostDialogButtons}
        onCancel={hideDeletePostDialog}
        onSubmit={deletePost}
      >
        <div>
          <Trans>
            You are about to delete the blog post « { post.title } ». Do you really want to take that action?
          </Trans>
        </div>
      </InformationPopup>
    </div>
  )
}
