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
  const fetchPosts = useCallback(async term => {
    const answer = await graphqlQuery(postsQuery, { ...postsParams, search: term })
    return postsAnswerResolver(answer) ?? []
  }, [graphqlQuery, postsQuery, postsParams, postsAnswerResolver])
  useEffect(() => {
    let isCancelled = false
    fetchPosts(searchTerm).then(posts => {
      if (isCancelled) {
        return
      }
      setPosts(posts)
    }).catch(console.error)
    return () => {
      isCancelled = true
    }
  }, [fetchPosts, searchTerm])
  async function handleSearchChange(e) {
    const keyword = e?.target?.value ?? ''
    setSearchTerm(keyword)
  }
  function handleClear() {
    setSearchTerm('')
  }
  function onEnterPost(post) {
    navigate({
      pathname: PostRoute.pathParams({ id: post.id }),
    })
  }
  async function onDeletePost(post) {
    try {
      await graphqlMutate(deletePostMutation, { id: post.id })
      const posts = await fetchPosts(searchTerm)
      setPosts(posts)
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
        color={hasPrimaryColoredIcon ? 'primary' : undefined}
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
                  <ClearIcon color={hasPrimaryColoredIcon ? 'primary' : 'inherit'} />
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
