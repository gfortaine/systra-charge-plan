import { T, useI18n } from '@src/utils/i18n'
import { useState } from 'react'
import { Chip, Stack, Button } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import DeleteIcon from '@mui/icons-material/Delete'
import EnterIcon from '@mui/icons-material/ArrowRight'
import InformationPopup from '@comp/utils/InformationPopup'
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
      icon: (<CancelIcon />),
    },
    {
      type: 'submit',
      label: t('Confirm'),
      icon: (<DeleteIcon />),
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
        <span>
          <T>Published by</T>
        </span>
        <span className="author">{ authorName }</span>
        <span className="publication-date">
          <T one="on {{localeDate}} at {{localTime}}" localeDate={localeDate} localeTime={localeTime} />
        </span>
      </div>
      <div className="actions">
        <Button
          variant="text"
          size="small"
          color="secondary"
          startIcon={(<DeleteIcon />)}
          onClick={showDeletePostDialog}
        />
        <Button
          variant="text"
          size="small"
          color="secondary"
          startIcon={(<EnterIcon />)}
          onClick={enterPost}
        />
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
            one="You are about to delete the blog post « {{post}} ». Do you really want to take that action?"
            post={post.title}
          />
        </div>
      </InformationPopup>
    </div>
  )
}
