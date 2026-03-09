import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import {
  Add,
  ArrowBack,
  Delete,
  Edit,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  Stack,
  Typography,
} from '@mui/material'
import Comment from '@comp/post/Comment'
import CommentForm from '@comp/post/CommentForm'
import InformationPopup from '@comp/utils/InformationPopup'
import { backUrl } from '@src/config'
import useGraphql from '@src/graphql'
import { createCommentMutation, deleteCommentMutation, updateCommentMutation } from '@src/graphql/mutations'
import { getPostQuery } from '@src/graphql/queries'
import { T, useI18n } from '@src/i18n'
import useRoutes from '@src/routes'

export default function Post() {
  const { id: postId } = useParams()
  const navigate = useNavigate()
  const { HomeRoute, CategoryRoute } = useRoutes()
  const { graphqlQuery, graphqlMutate } = useGraphql()
  const { t, locale } = useI18n()

  const [post, setPost] = useState({})
  const fetchPost = useCallback(async (setPost) => {
    try {
      const { post } = await graphqlQuery(getPostQuery, { id: postId })
      setPost(post)
    } catch (err) {
      console.error(err)
    }
  }, [graphqlQuery, postId])
  const pushAddComment = useCallback(async (comment) => {
    try {
      await graphqlMutate(
        createCommentMutation,
        {
          postId,
          text: comment.text,
          authorId: comment.author.id,
        },
      )
    } catch (err) {
      console.error(err)
    }
  }, [graphqlMutate, postId])
  const pushEditComment = useCallback(async (comment) => {
    try {
      await graphqlMutate(
        updateCommentMutation,
        {
          id: comment.id,
          text: comment.text,
          authorId: comment.author.id,
        },
      )
    } catch (err) {
      console.error(err)
    }
  }, [graphqlMutate])
  const pushDeleteComment = useCallback(async (comment) => {
    try {
      await graphqlMutate(
        deleteCommentMutation,
        { id: comment.id },
      )
    } catch (err) {
      console.error(err)
    }
  }, [graphqlMutate])
  useEffect(() => {
    fetchPost(setPost)
  }, [fetchPost, postId])
  const imageFullUrl = useMemo(() => {
    if (post.imageUrl) {
      if (post.imageUrl[0] === '/') {
        return backUrl + post.imageUrl.substring(1)
      } else {
        return backUrl + post.imageUrl
      }
    } else {
      return null
    }
  }, [post])
  const authorName = post.author?.fullName || ''
  const publicationDate = new Date(post.pubdate)
  const localeDate = publicationDate ? publicationDate.toLocaleDateString(locale) : ''
  const categories = post.categories || []

  const [currentComment, setCurrentComment] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  function goBack() {
    navigate({ pathname: HomeRoute.path })
  }

  function openAdd() {
    setShowAdd(true)
  }
  async function handleAdd() {
    await pushAddComment(currentComment)
    await fetchPost(setPost)
    cancelAdd()
  }
  function cancelAdd() {
    setShowAdd(false)
  }

  function openEdit(comment) {
    setCurrentComment(comment)
    setShowEdit(true)
  }
  async function handleEdit() {
    await pushEditComment(currentComment)
    await fetchPost(setPost)
    cancelEdit()
  }
  function cancelEdit() {
    setShowEdit(false)
    setCurrentComment(null)
  }

  function openDelete(comment) {
    setCurrentComment(comment)
    setShowDelete(true)
  }
  async function handleDelete() {
    await pushDeleteComment(currentComment)
    await fetchPost(setPost)
    cancelDelete()
  }
  function cancelDelete() {
    setShowDelete(false)
    setCurrentComment(null)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Card sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ArrowBack />}
          onClick={goBack}
          sx={{ alignSelf: 'flex-start' }}
        >
          <T>Return</T>
        </Button>
        {/* Header */}
        <Box>
          <Typography variant="h4">
            {post.title}
          </Typography>
          {imageFullUrl && (
            <Box component="img" src={imageFullUrl} alt="Post image" sx={{ maxWidth: 400, maxHeight: 200 }} />
          )}
          <Typography variant="subtitle1">
            Published by
            {' '}
            <span>{authorName}</span>
            {' '}
            on
            {' '}
            <span>{localeDate}</span>
          </Typography>
          {categories.length > 0 && (
            <Stack direction="row" spacing={1}>
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  component={NavLink}
                  to={CategoryRoute.pathParams({ id: cat.id })}
                  size="small"
                  variant="contained"
                  color="secondary"
                >
                  {cat.name}
                </Button>
              ))}
            </Stack>
          )}
        </Box>
        {/* Body */}
        <Typography>{post.text}</Typography>
        {/* Comments */}
        <Box sx={{ borderTop: '1px solid black', mt: 4, pt: 2 }}>
          <Typography variant="h6">
            <T>Comments</T>
          </Typography>
          <Stack spacing={1} sx={{ mb: 2 }}>
            {post.comments?.map(comment => (
              <Comment
                key={comment.id}
                comment={comment}
                onEditComment={() => { openEdit(comment) }}
                onDeleteComment={() => { openDelete(comment) }}
              />
            ))}
          </Stack>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={openAdd}
          >
            <T>Add a comment</T>
          </Button>
        </Box>
        {/* Add Dialog */}
        <InformationPopup
          open={showAdd}
          title={t('Add a comment')}
          buttons={[
            { type: 'cancel', label: t('Cancel') },
            { type: 'submit', label: t('Add'), icon: (<Add />) },
          ]}
          onCancel={cancelAdd}
          onSubmit={handleAdd}
        >
          <CommentForm onChange={comment => setCurrentComment(comment)} />
        </InformationPopup>
        {/* Edit Dialog */}
        <InformationPopup
          open={showEdit}
          title={t('Edit a comment')}
          buttons={[
            { type: 'cancel', label: t('Cancel') },
            { type: 'submit', label: t('Edit'), icon: (<Edit />) },
          ]}
          onCancel={cancelEdit}
          onSubmit={handleEdit}
        >
          {currentComment && (
            <CommentForm
              comment={currentComment}
              onChange={comment => setCurrentComment({ ...currentComment, ...comment })}
            />
          )}
        </InformationPopup>
        {/* Delete Dialog */}
        <InformationPopup
          open={showDelete}
          title={t('Delete a comment')}
          buttons={[
            { type: 'cancel', label: t('Cancel') },
            { type: 'submit', label: t('Delete'), icon: (<Delete />), color: 'error' },
          ]}
          onCancel={cancelDelete}
          onSubmit={handleDelete}
        >
          {currentComment && (
            <Box>
              <T
                one="You are about to delete the comment « {{ comment }} ». Do you really want to take that action?"
                comment={currentComment.date}
              />
            </Box>
          )}
        </InformationPopup>
      </Card>
    </Box>
  )
}
