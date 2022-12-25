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
  Card, CardActions, CardContent, CardMedia 
} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"

// import { postDelete, postLike } from "../../redux/posts/postActions"
import { useDispatch, useSelector } from "react-redux"
import axios from 'axios'
import { toast } from "react-toastify";
import { useRouter } from "next/router";



const PostCard = ({ post, setUpdatePost }) => {
  const router = useRouter();
  // console.log("router", router.pathname)

  const dispatch = useDispatch()
  // const postGet = useSelector(state => state.postGet)
  // console.log({postGet})

  // const profile = useSelector(state => state.profile)
  // const { loading, error, dbUser } = profile;



  const deletePost = async (id) => {
    let answer = window.confirm("Are you sure you want to delete")
    if (!answer) {
      return
    }
    dispatch(postDelete(id))     // PROBLEM HERE AS LOADING IS UPDATED IN REDUX
    // console.log({postGet})    // BUT LOCAL STATE (POSTGET) NOT UPDATING IMMEDIATELY

    if (postGet.error) {
      console.log(postGet.error)
      // return toast.error(postGet.error)
      return toast.error('failed to delete post')
    }

    if (postGet.loading) {
      return <h1>Loading...</h1>
    } else {
      toast.success("post deleted")
    } 


    // router.push('/src/user/profile');  // NEED TO UPDATE THIS TO ROUTER.RELOAD() AFTER REDUX IS UPDATED
    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // }

    // try {
    //   const { data } = await axios.delete(`/api/posts/${id}` )
    //   console.log({data})

    //   if (data.error) {
    //     console.log({error: data.error})
    //     toast.error(data.error + " 🤯")
    //   }

    //   if (data && !data.error) { 
    //     toast.success(data.success + " 🚀")
    //     router.push('/src/user/profile');    // NEED TO UPDATE THIS TO ROUTER.RELOAD() AFTER REDUX IS UPDATED
    //   }
      
    // } catch (error) {
    //   console.log(error)
    // }
  };


  const likePost = async (id) => {
    const hasLiked = post?.likes.includes(dbUser?._id)  // checks and see if the user is already liked the current post
    // console.log({hasLiked})
    if (!hasLiked) {
      try {
        dispatch(postLike(id))

        if (postGet.error) {
          console.log(postGet.error)
          return toast.error(postGet.error)
          // return toast.error('failed to delete post')
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
    <Card sx={{ maxWidth: 230, maxHeight: 440, ml: '1rem', my: '1rem' }} >
      <CardMedia
        component="img"
        height="140"
        image={post?.image}
        alt="green iguana"
      />
      <CardContent sx={{ minHeight: 210 }}>
        <Typography gutterBottom variant="h4" component="div">
          {post?.title}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          {post?.creater}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: '1rem' }}>
          {post?.message.length > 60 ? post?.message.substring(0, 60) + '...' : post?.message }
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: '1rem' }}>
          {/* {post?.tags.map(tag => tag.length > 22 ? `${tag.substring(0, 22)} + ...` : post?.tags )} */}
          {post?.tags.map((tag) =>
              tag.length > 22 ? `#${tag.substring(22, 0)}` + "..." : `#${tag} `
            )}
        </Typography>
      </CardContent>


      <CardActions sx={{ }}>
        <Grid container >
          <Grid container>
            <Button 
              size="small" 
              // onClick={() => likePost(post._id)} 
              >
                Like
                { post?.likes.includes(dbUser?._id) ? 
                  (<ThumbUpIcon sx={{ ml: "0.25rem", mt: "-0.3rem" }}/>) : 
                  (<ThumbUpAltOutlinedIcon sx={{ ml: "0.25rem", mt: "-0.3rem" }} />) 
                }
            </Button>
            <Typography 
              variant="body2" 
              sx={{ mt: "0.27rem", ml: ".6rem" , color: "#ffcd38" }}>
                {post?.likeCount === 0 ? "" : post?.likeCount}{" "} 
                {post?.likeCount === 0 ? 'not liked' : post?.likeCount === 1 ? "like" : "likes"}
            </Typography>
          </Grid>
          
          {router.pathname === '/src/user/dashboard' && (
          <Grid container sx={{ display: 'flex', justifyContent: 'space-between'}}>
            <Button 
              size="small" 
              // onClick={() => deletePost(post._id)} 
              sx={{ mr: "0.5rem" }} >
                Delete
                <DeleteIcon sx={{ ml: "0.25rem" }}/>
            </Button>
            <Button 
              size="small" 
              onClick={() => setUpdatePost(post._id)} >
                Update
                <EditIcon sx={{ ml: "0.25rem" }} />
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