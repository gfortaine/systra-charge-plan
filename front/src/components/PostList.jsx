import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useRoutes from '@src/routes'
import useGraphql from '@src/utils/graphql'
import { getAllPostsQuery } from '@src/queries'
import { deletePostMutation } from '@src/mutations'
import { TextField, IconButton, InputAdornment, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Close'
import PostCard from './PostCard'
import { useTranslation } from '@src/lioness'
import './PostList.scoped.scss'

export default function PostList({
  search = '',
  onSearchTermChanged = () => {},
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { PostRoute } = useRoutes()
  const { graphqlQuery, graphqlMutate } = useGraphql()
  const [posts, setPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState(search)
  const [hasPrimaryColoredIcon, setHasPrimaryColoredIcon] = useState(false)
  const fetchPosts = useCallback(async (search) => {
    try {
      const { allPosts } = await graphqlQuery(getAllPostsQuery, { search })
      setPosts(allPosts)
    } catch (err) {
      console.error(err)
    }
  }, [graphqlQuery])
  useEffect(() => {
    fetchPosts(searchTerm)
  }, [fetchPosts, searchTerm])
  async function handleSearchChange(e) {
    const keyword = e?.target?.value ?? ''
    setSearchTerm(keyword)
    onSearchTermChanged(keyword)
  }
  async function handleClear() {
    await handleSearchChange(null)
  }
  async function onEnterPost(post) {
    await navigate({
      pathname: PostRoute.replaceParams({ id: post.id }),
    })
  }
  async function onDeletePost(post) {
    try {
      await graphqlMutate(deletePostMutation, { id: post.id })
      await fetchPosts(searchTerm)
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
