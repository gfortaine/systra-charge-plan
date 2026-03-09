import { useEffect, useState, useCallback } from 'react'
import { TextField, IconButton, InputAdornment, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'
import useRoutes from '@src/routes'
import useGraphql from '@src/graphql'
import { getAllPostsQuery } from '@src/graphql/queries'
import { deletePostMutation } from '@src/graphql/mutations'
import { useI18n } from '@src/i18n'
import PostCard from './PostCard'
import './PostList.scoped.scss'

export default function PostList({
  postsQuery = getAllPostsQuery,
  postsParams = {},
  postsAnswerResolver = answer => answer.allPosts,
}) {
  const { t } = useI18n()
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
        label={t('Search')}
        placeholder={t('keyword')}
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
