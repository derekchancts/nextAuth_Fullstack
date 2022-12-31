import { useState, useEffect} from 'react'
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts, postsFetch, selectPostsLoading, selectPostsError } from '../../../store/postsSlice'
import { selectCurrentUser, selectUserLoading, selectUserError, authFetch } from '../../../store/authSlice'
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

import { ConfirmProvider } from "material-ui-confirm";

import { parseCookies } from "nookies";
import { useSession } from "next-auth/react";




const Posts = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState('');
  const [currentPosts, setcurrentPosts] = useState([]);

  const user = useSelector(selectCurrentUser);
  const userLoading = useSelector(selectUserLoading);
  const userError = useSelector(selectUserError);

  const postsloading = useSelector(selectPostsLoading);
  const postserror = useSelector(selectPostsError);

  const [currentUser, setcurrentUser] = useState('');

  // console.log({loading})
  // console.log({error})


  //! RETRIEVE THE POST (FOR UPDATING)
  // const [updatePost, setUpdatePost] = useState("")
  // console.log({updatePost})

  const posts = useSelector(selectPosts);
  // console.log({posts})


  const { data: session } = useSession();
  const cookies = parseCookies();


  useEffect(() => {
    //! check and see if we have a cookie or a session
    const user = cookies?.user ? JSON.parse(cookies.user) : session?.user ? session.user : "";

    //! if we have a user, then call "authFetch"
    if (user && user !== 'undefined' && user !== null) dispatch(authFetch(user))
    
    setcurrentUser(user)
  }, [cookies.user, session, dispatch])



  useEffect(() => {
    if (currentUser && currentUser.length !== 0) dispatch(postsFetch());
  }, [currentUser, router, dispatch])



  if (!currentUser && currentUser.length === 0) {
    return (
      <Box
        sx={{ 
          display: "flex" ,
          width: '100vw' ,
          height: '90vh' ,
          // height: '500px',
          // width: '500px',
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: "lightblue"
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography component="h1" variant="h4">
            Please log in to see posts
          </Typography>
          <Link href="/src/user/login" passHref style={{ textDecoration: 'none' }} >
            <Button variant="contained" fullWidth sx={{ mt: '1rem' }}>Go to Login Page</Button>
          </Link>
        </Box>

        {/* <Grid 
          container 
          direction="column"
          justifyContent="center"
          alignItems="center" 
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography component="h1" variant="h4">
              Please log in to see posts
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Link href="/src/user/login" passHref style={{ textDecoration: 'none' }} >
              <Button variant="contained" fullWidth sx={{ mt: '1rem' }}>Go to Login Page</Button>
            </Link>
          </Grid>
        </Grid> */}
      </Box>
    )
  }


  if (Array.isArray(posts) && posts.length === 0 && postsloading === 'pending') {
    return (
      <Box
        sx={{ 
          display: "flex" ,
          width: '100vw' ,
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
  
  
  if (postserror) {
    return (
      <Box sx={{ 
        mt: '2rem',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <Typography component="h1" variant="h4">
          {postserror}
        </Typography>
      </Box> 
  )}


  return (
    <ConfirmProvider>
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
                // <PostCard key={post._id} post={post} setUpdatePost={setUpdatePost} />
                <PostCard key={post._id} post={post} />
              ))}  
            </Grid>
          </Grid>
        </Grid>

        </>
      </Container>
    </ConfirmProvider>
  )
}

export default Posts