import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { T } from '@src/i18n'
import useRoutes from '@src/routes'

export default function Category() {
  const { id: catId } = useParams()
  const navigate = useNavigate()
  const { HomeRoute } = useRoutes()
  const { graphqlQuery } = useGraphql()

  const [category, setCategory] = useState({})
  const fetchCategory = useCallback(async (setCategory) => {
    try {
      const { category } = await graphqlQuery(categoryQuery, { id: catId })
      setCategory(category)
    } catch (err) {
      console.error(err)
    }
  }, [graphqlQuery, catId])
  useEffect(() => {
    fetchCategory(setCategory)
  }, [fetchCategory, catId])

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
        <T>Return</T>
      </Button>
      <Box>
        <Typography variant="h6">
          <T one="Category {{ name }}:" name={category.name} />
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
