import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import { parseCookies } from "nookies";
import cookie from 'js-cookie';
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from '../store/authSlice'
import { toast } from "react-toastify";
import axios from 'axios'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import EmailIcon from '@mui/icons-material/Email';


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

import Form from '../components/form/Form'
import PostCard from "../components/posts/PostCard";



export default function Component({ session }) {
  const router = useRouter();
  // const { data: session, status } = useSession();

  const [currentLoggedInUser, setCurrentLoggedInUser] = useState('');

  // console.log({session})
  // console.log({status})

  // useEffect(() => {
  //   const cookies = parseCookies();
  //   const user = cookies?.user ? JSON.parse(cookies.user) : session?.user ? session.user : "";
  //   setCurrentLoggedInUser(user);

  //   if (!user) router.push("/src/user/login");
  // }, [session?.user, router])


  //! if use redux
  const dispatch = useDispatch();
  // const user = useSelector(state => state.auth.currentUser)
  const user = useSelector(selectCurrentUser)


  useEffect(() => {
    if (!user) router.push("/src/user/login");

    setCurrentLoggedInUser(user);
  }, [user, router])



  const emailReset = async () => {
    let config = { headers: { "Content-Type": "application/json" } };

    try {
      // console.log({user})
      const { data } = await axios.post('/api/user/emailReset', { user }, config);

      // if (data.error) {
      //   toast.error(data.error.message)
      //   return
      // }

      toast.success(data.success);
    } catch (error) {
      console.log(error.response);
      toast.error(error?.response?.data?.error);
    }
  };


  return (
    <>
      {currentLoggedInUser && (
        // <>
        //   <Typography component="h1" variant="h5">
        //     Dashboard
        //   </Typography>
        //   {`Logged in as: ` + currentLoggedInUser?.email}
        // </>

        <Container maxWidth="lg">
          <Box
            sx={{
              marginTop: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1>Profile </h1>

            {/* <Button variant="outlined" color="secondary"> */}
              <Link href="/src/user/author" variant="body2" style={{ textDecoration: 'none' }}>
                To Author Page
              </Link>
            {/* </Button> */}
            

            <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
              {currentLoggedInUser.name}
            </Typography>
            <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
              {currentLoggedInUser.email}
            </Typography>
            <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
              {currentLoggedInUser.validEmail && " "}
              {currentLoggedInUser.validEmail === "not" && (
                <Button 
                  variant="outlined" 
                  color="btn" 
                  onClick={emailReset} 
                  endIcon={<EmailIcon />
                }>Click here to Verify Email Address</Button>
              )}
            </Typography>

          </Box>


          <Grid container maxWidth="lg" sx={{ mt: '1rem' }} >

          {/* <Grid item xs={8} sx={{ display: "flex", flexDirection: 'row', flexWrap: 'wrap'}}>
            {posts && posts.map(post => (
              <PostCard key={post._id} post={post} setUpdatePost={setUpdatePost} />
            ))}
          </Grid> */}

            <Grid item xs={4}>
              {/* <Form post={postData} setUpdatePost={setUpdatePost} />   */}
              <Form  />  
            </Grid>

          </Grid>


        </Container>
      )}
    </>
  )

}



export const getServerSideProps = async (context) => {
  const session = await getSession(context)

  return {
    props: {
      session
    }
  }
}