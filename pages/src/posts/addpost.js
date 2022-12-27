import { useState, useEffect } from "react"

import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import PostAddIcon from '@mui/icons-material/PostAdd';

import { useRouter } from "next/router"
// import Router from 'next/router'

import FileBase from "react-file-base64"
import axios from 'axios';
import { toast } from "react-toastify";

// import { createPosts, updatePost } from "../../redux/posts/postActions"
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentUser } from '../../../store/authSlice'



function Form({ post, setUpdatePost }) {
  const [creater, setCreater] = useState("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [tags, setTags] = useState("")
  const [selectedFile, setSelectedFile] = useState("")

  const router = useRouter()
  const dispatch = useDispatch()
  // const postGet = useSelector((state) => state.postGet)
  // console.log({postGet})

  const user = useSelector(selectCurrentUser);


  function reset() {
    setMessage("")
    setTags("")
    setCreater("")
    setTitle("")
    setSelectedFile("")
  };


  useEffect(() => {
    if (!user) router.push("/src/user/login");
  }, [user, router])


  //! populate the form - for updating existing post 
  useEffect(() => {
    if (post) {
      setMessage(post.message)
      setTags(post.tags)
      setCreater(post.creater)
      setTitle(post.title)
      // setSelectedFile(post.image)
    }
  }, [post])



  // const updatePost = async (id, memoryData) => {
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }

  //   try {
  //     const { data } = await axios.put(`/api/posts/${id}`, { memoryData }, config )
  //     console.log({data})
  //   } catch (error) {
  //     console.log(error)
  //   }
  // };

  const getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        // console.log("Called", reader);
        baseURL = reader.result;
        // console.log(baseURL);
        resolve(baseURL);
      };
      // console.log(fileInfo);
    });
  };

  
  const types = ['image/png', 'image/jpeg'];

  const handleChange = async (e) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      try {
        const result = await getBase64(selected)
        // console.log({result})
        setSelectedFile(result)
      } catch (error) {
        console.log({error})
      }
      // setSelectedFile(selected);
    } else {
      alert('Please select an image file (png or jpg)');
      setSelectedFile("");
      return
    }
  };



  const SubmitHandler = async (e) => {
    e.preventDefault()

    if (!creater || !title || !message || !tags || !selectedFile) {
      alert('all fields must not be empty')
      return
    }

    let memoryData = {
      tags,
      image: selectedFile,
      message,
      creater,
      title,
    }

    // dispatch(startLoading())
    console.log({memoryData});  

    
    try {
      let config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post('/api/posts', { memoryData }, config);
      console.log(data)

      reset() 
      router.push('/src/posts/posts')
    } catch (err) {
      console.error('Failed to save the post', err)
    }


    /*
    if (post) {
      // updatePost(post._id, memoryData)
      dispatch(updatePost(post._id, memoryData))   // PROBLEM HERE AS LOADING IS UPDATED IN REDUX
      // console.log({postGet})                       // BUT LOCAL STATE (POSTGET) NOT UPDATING IMMEDIATELY
      // console.log(postGet.error, postGet.loading)   

      if (postGet.error || postGet.error !== null) {
        console.log(postGet.error)
        // return toast.error(postGet.error)
        return toast.error('failed to update post')
      } 

      if (postGet.error === null && !postGet.loading) {
        toast.success("post updated")
        memoryData = {}
        reset();
        // router.push('/src/user/profile');
      }
    } else {
      dispatch(createPosts(memoryData))
      if (postGet.error || postGet.error !== null) {
        console.log(postGet.error)
        // return toast.error(postGet.error)
        return toast.error('failed to create post')
      }

      toast.success("post created")
      memoryData = {}
      reset();
      // router.push('/src/user/profile');   // NEED TO CHANGE THIS AFTER REDUX IS UPDATED
    } 
    */
  };



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
            <PostAddIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            {post ? "Edit" : "Add"} Post
          </Typography>

          {post && (
            <Button 
              onClick={() => {
                setUpdatePost("")
                reset();
              }}
            >Clear</Button>
          )}

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
                  onChange={(e) => setCreater(e.target.value)}
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

              <Grid item xs={12}>
                {/* <FileBase
                  type="file"
                  multiple={false}
                  onDone={({ base64 }) => setSelectedFile(base64)}
                /> */}
                 <input type="file" onChange={handleChange}/>
              </Grid>
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
            >
              { post ? "Edit" : "Submit" }
            </Button>

          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Form
