import { useState, useCallback, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
} from '@mui/material'
import {
  ArrowBack,
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import useRoutes from '@src/routes'
import useGraphql from '@src/graphql'
import { getCategoryQuery, getCategoryPostsQuery } from '@src/graphql/queries'
import { T } from '@src/i18n'
import PostList from '@comp/post/PostList'

export default function Category() {
  const { id: catId } = useParams()
  const navigate = useNavigate()
  const { HomeRoute } = useRoutes()
  const { graphqlQuery } = useGraphql()

  const [category, setCategory] = useState({})
  const fetchCategory = useCallback(async (setCategory) => {
    try {
      const { category } = await graphqlQuery(getCategoryQuery, { id: catId })
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
        postsQuery={getCategoryPostsQuery}
        postsParams={{ id: catId }}
        postsAnswerResolver={answer => answer.category.posts}
      />
    </Box>
  )
}
