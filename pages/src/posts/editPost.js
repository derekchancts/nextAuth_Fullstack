import { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux"
import { selectPosts, selectPostsLoading, selectPostsError, postsFetch, postUpdate } from '../../../store/postsSlice'
import { selectCurrentUser } from '../../../store/authSlice'

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
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';



const EditPost = () => {
  const [creater, setCreater] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [tags, setTags] = useState([])

  const [selectedPostdata, setselectedPostdata] = useState([]);
  
  const dispatch = useDispatch()
  const posts = useSelector(selectPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);

  const router = useRouter()
  const { query: { id } } = router
  // console.log({id})

  const user = useSelector(selectCurrentUser);
  

  function reset() {
    setMessage("")
    setTags("")
    setCreater("")
    setTitle("")
    // setSelectedFile("")
  };

  
  useEffect(() => {
    if (!user) router.push("/src/user/login");
    if (user) dispatch(postsFetch());
  }, [user, router, dispatch])


  useEffect(() => {
    const selectedPost = posts.filter(post => post._id === id)
    // console.log({selectedPost})
    setselectedPostdata(selectedPost[0])
    // console.log({selectedPosts})

    if (selectedPostdata) {
      setCreater(selectedPostdata.creater)
      setTitle(selectedPostdata.title)
      setMessage(selectedPostdata.message)
      setTags(selectedPostdata.tags)
    }
  }, [id, posts, selectedPostdata])
  

  if (Array.isArray(posts) && posts.length === 0 && loading === 'pending') {
  // if (loading === 'pending') {
    return (
      <Box
        sx={{ 
          display: "flex" ,
          width: '95vw' ,
          height: '90vh' ,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={100}/>
      </Box>
  )}


  const SubmitHandler = async (e) => {
    e.preventDefault()
    // console.log(creater, title, message, tags)

    const post = {creater, title, message, tags, id}

    try {
      dispatch(postUpdate(post)).unwrap()

      reset() 
      router.push('/src/posts/posts')
    } catch (err) {
      console.error('Failed to update the post', err)
    }
  }


  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <EditIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Edit Post
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={SubmitHandler}
            sx={{ mt: 3 }}
          >

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="creater"
                  name="creater"
                  required
                  fullWidth
                  id="creater"
                  label="Creater"
                  autoFocus
                  value={creater}
                  // onChange={(e) => setCreater(e.target.value)}
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="Title"
                  label="Title"
                  name="Title"
                  autoComplete="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="Message"
                  label="Message"
                  name="Message"
                  autoComplete="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="tags"
                  label="tags"
                  type="tags"
                  id="tags"
                  autoComplete="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value.split(","))}
                />
              </Grid>

              {/* <Grid item xs={12}>
                 <input type="file" onChange={handleChange}/>
              </Grid> */}
            </Grid>

            <Grid
              container
              sx={{
                mt: 2,
                mb: 2,
                border: 1,
                borderRadius: 1,
                borderColor: "grey.400",
              }}
            ></Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2, backgroundColor: "primary.main" }}
              // disabled="true"
              // disabled={loading === 'pending' ? true : false}
            >
              {/* { loading === 'pending' ? "Submitting..." : "Submit" } */}
              Submit
            </Button>

          </Box>
        </Box>
      </Container>
    </>
  )
}

export default EditPost