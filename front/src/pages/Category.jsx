import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Trans } from '@lingui/react/macro'
import {
  ArrowBack,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Typography,
} from '@mui/material'
import PostList from '@comp/post/PostList'
import useGraphql from '@src/graphql'
import categoryQuery from '@src/graphql/Category.query.graphql'
import categoryPostsQuery from '@src/graphql/CategoryPosts.query.graphql'
import useRoutes from '@src/routes'

export default function Category() {
  const { id: catId } = useParams()
  const navigate = useNavigate()
  const { HomeRoute } = useRoutes()
  const { graphqlQuery } = useGraphql()

  const [category, setCategory] = useState({})
  useEffect(() => {
    let isCancelled = false
    graphqlQuery(categoryQuery, { id: catId }).then(({ category }) => {
      if (isCancelled) {
        return
      }
      setCategory(category)
    }).catch(console.error)
    return () => {
      isCancelled = true
    }
  }, [graphqlQuery, catId])

  function goBack() {
    navigate({ pathname: HomeRoute.path })
  }

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<ArrowBack />}
        onClick={goBack}
        sx={{ alignSelf: 'flex-start' }}
      >
        <Trans>Return</Trans>
      </Button>
      <Box>
        <Typography variant="h6">
          <Trans>Category { category.name }:</Trans>
        </Typography>
      </Box>
      <PostList
        postsQuery={categoryPostsQuery}
        postsParams={{ id: catId }}
        postsAnswerResolver={answer => answer.category.posts}
      />
    </Box>
  )
}
