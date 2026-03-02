import './PostList.scoped.scss'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import routes from '@src/routes'
import useGraphql from '@src/utils/graphql'
import { getAllPostsQuery } from '@src/queries'
import { deletePostMutation } from '@src/mutations'
import { TextField, IconButton, InputAdornment, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Close'
import PostCard from './PostCard'

export default function PostList({
  providedPosts = null,
  search = '',
  onRefreshRequired = () => {},
  onSearchTermChanged = () => {},
}) {
  const navigate = useNavigate()
  const postRoute = routes.byTitle('Post')
  const { graphqlQuery, graphqlMutate } = useGraphql()
  const [posts, setPosts] = useState([])
  const hasFetchedRef = useRef(false)
  const [searchTerm, setSearchTerm] = useState(search)
  const [hasPrimaryColoredIcon, setHasPrimaryColoredIcon] = useState(false)
  const loadData = useCallback(async () => {
    if (providedPosts) {
      onRefreshRequired()
      return
    } else if (hasFetchedRef.current) {
      return
    } else {
      hasFetchedRef.current = true
      const { allPosts } = await graphqlQuery(
        getAllPostsQuery, { search: searchTerm },
      ).catch(console.error)
      setPosts(allPosts)
    }
  }, [providedPosts, searchTerm, graphqlQuery, onRefreshRequired])
  useEffect(() => {
    loadData()
  }, [loadData])
  useEffect(() => {
    if (providedPosts != null) {
      setPosts(providedPosts.slice())
    }
  }, [providedPosts])
  useEffect(() => {
    if (search != null) {
      setSearchTerm(search)
    }
  }, [search])
  const isSearchTermNotEmpty = !!searchTerm
  async function onSearch(keyword) {
    if (keyword !== undefined) {
      setSearchTerm(keyword)
    }
    onSearchTermChanged(searchTerm)
    await loadData()
  }
  async function onClearSearch() {
    await onSearch('')
  }
  async function onEnterPost(post) {
    await navigate({
      pathname: routes.replacePathParams(postRoute.path, { id: post.id }),
    })
  }
  async function onDeletePost(post) {
    try {
      await graphqlMutate(deletePostMutation, { id: post.id })
      await loadData()
    } catch(e) {
      console.error(e)
    }
  }
  return (
    <Box className="posts">
      <TextField
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search"
        label="Search"
        placeholder="keyword"
        variant="standard"
        fullWidth
        color={hasPrimaryColoredIcon ? 'primary' : 'default'}
        onKeyDown={e => {
          if (e.key == 'Enter') {
            onSearch(searchTerm)
          }
        }}
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
                    onClearSearch()
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
            item={post}
            onEnterPost={() => onEnterPost(post)}
            onDeletePost={() => onDeletePost(post)}
          />
        ))}
      </Box>
    </Box>
  )
}
