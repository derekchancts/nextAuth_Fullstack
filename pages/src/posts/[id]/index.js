import styles from './SinglePost.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { postDelete, selectPosts, selectPostsLoading, selectPostsError, resetStatus, postLike, postsFetch } from '../../../../store/postsSlice'
import { selectCurrentUser } from '../../../../store/authSlice'
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link";
import AuthWrapper from '../../../../components/auth/authWrapper'

import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link as muiLink,
  Grid,
  Box,
  Typography,
  Container
} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"

import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { scale, fill, crop, thumbnail, Resize } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { lazyload } from '@cloudinary/react';

import { useConfirm } from "material-ui-confirm";
// import { ConfirmProvider } from "material-ui-confirm";


const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_NAME
  },
  // url: {
  //   secureDistribution: 'www.example.com',  
  //   secure: true  // force https, set to false to force http
  // }
});


const SinglePost = () => {
  const confirm = useConfirm();

  const dispatch = useDispatch();
  const [post, setpost] = useState('');

  const router = useRouter()
  const { query: { id } } = router
  // console.log({id})

  const user = useSelector(selectCurrentUser);
  const posts = useSelector(selectPosts);
  console.log({post}) 


  useEffect(() => {
    if (user && user.length !== 0 && posts.length === 0) dispatch(postsFetch())
  }, [user, router, dispatch, posts])


  useEffect(() => {
    const found = posts?.find(post => post._id === id)
    // console.log({found})
    setpost(found)
  }, [id, post, posts])
  

   
  //! cloudinary
  const myImage = cld.image(post?.image);
  // myImage.resize(fill().width(500).height(600).gravity(focusOn(FocusOn.face())));
  myImage.resize(fill().width(500).height(600));
  // myImage.resize(Resize.scale().width(300).height(180));


//! Delete a post
const deletePost = async (id) => {
  confirm({ description: "Are you sure you want to delete?" })
  .then(() => {
    dispatch(resetStatus());
    try {
      dispatch(postDelete(id)) 
      router.push('/src/posts/posts') 
    } catch (error) {
      console.log(error)
    } 
  })
};
  


  return (
    <>
      {user && post && ( 
        <Container component="main" maxWidth="xl" sx={{ height: '90vh'}}>

          {/* <Grid container columns={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6}}> */}
          <Grid 
            container 
            // columns={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6}}
            sx={{ 
              display: "flex",
              flexDirection: "row",
              // alignItems: "center",
            }}>
            {/* <Grid item xs={12}>
              <Grid container justifyContent="center"> */}

                <Grid 
                  item 
                  sx={{ mt: 4, padding: 2, display: "flex", alignItems: "center", justifyContent: "center" }} 
                  xs={12} sm={12} md={6} lg={6} xl={6}
                >
                  <AdvancedImage cldImg={myImage} plugins={[ lazyload() ]} />
                </Grid>

                <Grid 
                  item 
                  sx={{ mt: 4, p: 2, display: "flex", flexDirection: "column", alignItems: "center" }} 
                  xs={12} sm={12} md={6} lg={6} xl={6}
                >
                  <Typography 
                    gutterBottom variant="h4" 
                    component="div" 
                    sx={{ minHeight: 80, maxHeight: 80, display: "flex" , alignItems: 'center', justifyContent: 'center'}} 
                  >
                    {post?.title}
                  </Typography>

                  <Typography gutterBottom variant="h6" component="div">
                    author: {post?.creater}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: '1rem' }} className={styles.content}>
                    {post?.message}
                  </Typography>
          

                  <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                    <Button 
                      size="small" 
                      onClick={() => likePost(post._id)} 
                      >
                        Like
                        { post?.likes?.includes(user?._id) ? 
                          (<ThumbUpIcon sx={{ ml: "0.25rem", mt: "-0.3rem" }}/>) : 
                          (<ThumbUpAltOutlinedIcon sx={{ ml: "0.25rem", mt: "-0.3rem" }} />) 
                        }
                    </Button>
                    <Typography 
                      variant="body2" 
                      sx={{ mt: "0.3rem", ml: ".5rem" , color: "#ffcd38" }}>
                        {post?.likeCount === 0 ? 0 : post?.likeCount}{" "} 
                      {/* {post?.likeCount === 0 ? 'like' : post?.likeCount === 1 ? "like" : "likes"}  */}
                      {post?.likeCount <= 1 ? 'like' : "likes"} 
                    </Typography>
                  </Grid>


                  {post.userId === user._id && (
                  <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4}} gap={1}>
                      <Button 
                        size="small"
                        variant="outlined"
                        onClick={() => router.push(`/src/posts/posts`)} 
                      > Back to all posts
                      </Button>
                  
                      <Link 
                        href={{
                          pathname: "/src/posts/editPost",
                          query: { id: post._id },
                        }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          color="success"
                          // onClick={() => updatePost(post._id)} 
                          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        > Update
                        </Button>
                      </Link> 

                      {/* <Button 
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => router.push('/src/posts/editPost')} 
                      > Update
                      </Button>
                  */}
                      <Button 
                        size="small"
                        variant="outlined"
                        color="error" 
                        onClick={() => deletePost(post._id)} 
                        // sx={{ mr: "0.5rem" }} 
                      > Delete
                      </Button>
                  
                  </Grid>
                )} 




                </Grid>
          </Grid>
    
      </Container>
      )}
    </>
  )
}

export default SinglePost