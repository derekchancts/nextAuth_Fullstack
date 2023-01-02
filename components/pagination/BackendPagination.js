import { useEffect, useState } from "react"

import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import axios from 'axios'
// import { paginatePosts } from "../redux/posts/postActions"
import { useDispatch, useSelector } from "react-redux"
import { selectPosts, postsPagination, selectPostsCount } from '../../store/postsSlice'

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { darkTheme } from '../../theme'



const Paginate = () => {
  const [page, setPage] = useState(+0);

  const dispatch = useDispatch()

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));


  const posts = useSelector(selectPosts);
  console.log({posts})

//  const sortedPosts = posts.sort((a, b) => b.createdAt - a.createdAt)
  // consoel.log({sortedPosts})


  const postsCount = useSelector(selectPostsCount);
  // console.log({postsCount})

  useEffect(() => {
    const number = 1
    dispatch(postsPagination(number))
  }, [dispatch])


  const handleChange = async (e, page) => {
    // console.log({ page });
    setPage(page);

    try {
      // console.log(number)  
      // const { data } = await axios.get(`/api/posts/paginate/${number}`)
      // console.log(data)
      dispatch(postsPagination(+page))

      // window.scroll(0, 0);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    } catch (error) {
      console.log(error)  
    }
  };


  return (
    <ThemeProvider theme={darkTheme}>
      <Paper sx={{ borderRadius: 4 }} elevation={3}>
        <Pagination
          color="primary"
          // count={10}
          count={(posts && Number(postsCount)) || 1}
          // onChange={e => {
          // console.log(e.target)
          //   handleChange(e.target.textContent)
          // }}
          onChange={handleChange}
          renderItem={item => <PaginationItem {...item} />}
          // page={page}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: 10,
            marginBottom: 10,
            padding: '3px'
          }}
        />
      </Paper>
    </ThemeProvider>     
  )
}

export default Paginate