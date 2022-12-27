import { useState, useEffect} from 'react'
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts, postsFetch, selectPostsLoading, selectPostsError } from '../../../store/postsSlice'
import { selectCurrentUser } from '../../../store/authSlice'
import PostCard from '../../../components/posts/PostCard'

import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  // Link,
  Grid,
  Box,
  Typography,
  Container
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';



const Posts = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState('');
  const [currentPosts, setcurrentPosts] = useState([]);

  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  console.log({loading})
  console.log({error})


  //! RETRIEVE THE POST (FOR UPDATING)
  const [updatePost, setUpdatePost] = useState("")
  console.log({updatePost})

  const posts = useSelector(selectPosts);
  // console.log({posts})

  useEffect(() => {
    if (!user) router.push("/src/user/login");
    if (user) dispatch(postsFetch());
  }, [user, router, dispatch])


  if (loading === 'pending') {
    return (
      <Box
        sx={{ 
          display: "flex" ,
          width: '95vw' ,
          height: '90vh' ,
          // height: '500px',
          // width: '500px',
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: "lightblue"
        }}
      >
        <CircularProgress size={100}/>
      </Box>
  )}
  
  
  if (error) {
    return (
      <Box sx={{ 
        mt: '2rem',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <Typography component="h1" variant="h4">
          {error}
        </Typography>
      </Box> 
    )
  }


  return (
    <Container component="main" maxWidth="lg">
      <>
      <Box sx={{ 
        mt: '2rem',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <Typography component="h1" variant="h4">
          Posts
        </Typography>
      </Box> 

      <Grid sx={{ flexGrow: 1, mt: '1rem' }} container maxWidth="xl" spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={2}>
            {posts && posts.map(post => (
              <PostCard key={post._id} post={post} setUpdatePost={setUpdatePost} />
            ))}  
          </Grid>
        </Grid>
      </Grid>

      </>
    </Container>
  )
}

export default Posts