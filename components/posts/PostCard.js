import styles from './PostCard.module.css'

import Link from "next/link";
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
  Container,
  Card, CardActions, CardContent, CardMedia,
  Paper
} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"

import { useDispatch, useSelector } from "react-redux"
import axios from 'axios'
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { selectCurrentUser } from '../../store/authSlice'
import { postDelete, selectPosts, selectPostsLoading, selectPostsError, resetStatus, postLike } from '../../store/postsSlice'

import { useConfirm } from "material-ui-confirm";

import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { scale, fill, crop, thumbnail, Resize } from "@cloudinary/url-gen/actions/resize";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { lazyload } from '@cloudinary/react';



const PostCard = ({ post }) => {
  const confirm = useConfirm();

  const router = useRouter();
  // console.log("router", router.pathname)

  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser);  
  const posts = useSelector(selectPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);


  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_NAME
    },
    // url: {
    //   secureDistribution: 'www.example.com',  
    //   secure: true  // force https, set to false to force http
    // }
  });

  const myImage = cld.image(post?.image);

  // myImage.resize(fill().width(300).height(180).gravity(focusOn(FocusOn.face())));
  myImage.resize(fill().width(300).height(180));
  // myImage.resize(Resize.scale().width(300).height(180));



  //! Delete a post
  const deletePost = async (id) => {
    //! could add a modal here instead
    // let answer = window.confirm("Are you sure you want to delete")
    // if (!answer) return

    // dispatch(resetStatus());
    // console.log({id})
    // console.log(typeof(id))

    confirm({ description: "Are you sure you want to delete?" })
    .then(() => {
      dispatch(resetStatus());

      try {
        dispatch(postDelete(id))  
      } catch (error) {
        console.log(error)
      }
         
      // if (loading === 'success' && !error) {
      //   return toast.success("post deleted")
      // }
    })

  };



  //! Like a post
  const likePost = async (id) => {
    const hasLiked = post?.likes?.includes(user?._id)  // checks and see if the user is already liked the current post
    console.log({hasLiked})

    if (!hasLiked) {
      try {
        dispatch(postLike(id))

        if (posts.error) {
          console.log(posts.error)
          return toast.error(posts.error)
        }
    
      } catch (error) { 
        console.log(error)
      }
    } else {
      toast.error('You already liked the post')
    }
  };


  return (
    <>
    <Card 
      sx={{ 
        minWidth: 300, 
        maxWidth: 300, 
        minHight: 550, 
        maxHeight: 550, 
        ml: '1rem', 
        my: '1rem', 
        borderRadius: 4, 
        // border: 1, 
        // borderColor: 'primary.main',
        boxShadow: 2
       }}>

      {/* <CardMedia
        component="img"
        height="140"
        image={post?.image}
        alt="post"
      /> */}

      <Box sx={{
         display: "flex" ,
         alignItems: 'center',
         justifyContent: 'center',
      }}>
        <AdvancedImage cldImg={myImage} plugins={[ lazyload() ]} />
      </Box>


      <CardContent sx={{ minHeight: 210 }}>
        <Typography 
          gutterBottom variant="h4" 
          component="div" 
          sx={{ minHeight: 80, maxHeight: 80, display: "flex" , alignItems: 'center', justifyContent: 'center'}} 
          className={styles.title}
        >
          {post?.title}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          author: {post?.creater}
        </Typography>

        <Box sx={{ minHeight: 50, maxHeight: 50 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: '1rem' }}>
            {post?.message?.length > 60 ? post?.message?.substring(0, 60) + '...' : post?.message }
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: '1.5rem' }}>
          {/* {post?.tags.map(tag => tag.length > 22 ? `${tag.substring(0, 22)} + ...` : post?.tags )} */}
          {post?.tags?.map((tag) =>
              tag.length > 22 ? `#${tag.substring(22, 0)}` + "..." : `#${tag} `
            )}
        </Typography>
      </CardContent>


      <CardActions>
        <Grid container >

          <Grid container>
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
          
          
          {/* {router.pathname === '/src/user/dashboard' && ( */}
          {/* {router.pathname === '/src/posts/posts' && ( */}
        {post.userId === user._id && (
          <Grid container sx={{ display: 'flex', justifyContent: 'center', mt: '10px'}} gap={2}>

           <Link 
             href={{
               pathname: "/src/posts/editPost",
               query: { id: post._id },
             }}
             >
              <Button 
                size="small" 
                variant="outlined"
                // onClick={() => updatePost(post._id)} 
              > Update
              </Button>
            </Link>

            <Button 
              size="small"
              variant="outlined"
              color="error" 
              onClick={() => deletePost(post._id)} 
              sx={{ mr: "0.5rem" }} 
            > Delete
            </Button>
          </Grid>
        )} 

        </Grid>
      </CardActions>

    </Card>
  </>
  )
}

export default PostCard