import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLingui } from '@lingui/react/macro'
import ClearIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
import useGraphql from '@src/graphql'
import allPostsQuery from '@src/graphql/AllPosts.query.graphql'
import deletePostMutation from '@src/graphql/DeletePost.mutation.graphql'
import useRoutes from '@src/routes'
import PostCard from './PostCard'
import './PostList.scoped.scss'

const defaultPostParams = {}
const defaultPostAnswerResolver = answer => answer.allPosts

export default function PostList({
  postsQuery = allPostsQuery,
  postsParams = defaultPostParams,
  postsAnswerResolver = defaultPostAnswerResolver,
}) {
  const { t } = useLingui()
  const navigate = useNavigate()
  const { PostRoute } = useRoutes()
  const { graphqlQuery, graphqlMutate } = useGraphql()
  const [posts, setPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [hasPrimaryColoredIcon, setHasPrimaryColoredIcon] = useState(false)
  const fetchPosts = useCallback(async (term, setPosts) => {
    try {
      const answer = await graphqlQuery(postsQuery, { ...postsParams, search: term })
      setPosts(postsAnswerResolver(answer))
    } catch (err) {
      console.error(err)
    }
  }, [graphqlQuery, postsQuery, postsParams, postsAnswerResolver])
  useEffect(() => {
    fetchPosts(searchTerm, setPosts)
  }, [fetchPosts, searchTerm])
  async function handleSearchChange(e) {
    console.log('handleSearchChange', { e })
    const keyword = e?.target?.value ?? ''
    setSearchTerm(keyword)
  }
  async function handleClear() {
    await handleSearchChange(null)
  }
  function onEnterPost(post) {
    navigate({
      pathname: PostRoute.pathParams({ id: post.id }),
    })
  }
  async function onDeletePost(post) {
    try {
      await graphqlMutate(deletePostMutation, { id: post.id })
      await fetchPosts(searchTerm, setPosts)
    } catch(e) {
      console.error(e)
    }
  }
  const isSearchTermNotEmpty = !!searchTerm
  return (
    <Box className="posts">
      <TextField
        value={searchTerm}
        onChange={handleSearchChange}
        className="search"
        label={t`Search`}
        placeholder={t`keyword`}
        variant="standard"
        fullWidth
        color={hasPrimaryColoredIcon ? 'primary' : 'default'}
        onFocus={() => setHasPrimaryColoredIcon(true)}
        onBlur={() => setHasPrimaryColoredIcon(false)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: isSearchTermNotEmpty && (
              <InputAdornment position="end">
                <IconButton
                  onClick={e => {
                    e.stopPropagation() // avoid input get the event
                    handleClear()
                  }}
                >
                  <ClearIcon color={hasPrimaryColoredIcon ? 'primary' : 'default'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Box className="posts-container">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onEnterPost={() => onEnterPost(post)}
            onDeletePost={() => onDeletePost(post)}
          />
        ))}
      </Box>
    </Box>
  )
}
