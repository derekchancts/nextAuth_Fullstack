import React, { useEffect } from "react"

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
  Container
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useRouter } from "next/router"
import axios from "axios"
import { toast } from "react-toastify"
import { setUser } from '../../../../store/authSlice'
import { useDispatch } from "react-redux";



export default function EmailConfirm() {
  const router = useRouter()
  const dispatch = useDispatch(); 


  useEffect(() => {
    const sendToken = async (token) => {
      try {
        let config = { headers: { "Content-Type": "application/json" } };
  
        const { data } = await axios.put(`/api/user/email/${token}`, {}, config);
        toast.success(data.success);

        // console.log({data})
        dispatch(setUser(data.user))

        router.push('/src/user/login');
      } catch (error) {
        toast.error(error?.response?.data?.error)
      }
    }

    //! Whether the router fields are updated client-side and ready for use. Should only be used inside of useEffect methods 
    if (router.isReady) {
      // console.log("useEffect", router.query);
      const { token } = router.query
      sendToken(token)
    }
  // }, [router.isReady, router.query]);
  }, [router.isReady, router.query, router, dispatch]);



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

          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Confirm Email
          </Typography>
          
          <Box
            component="form"
            // onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="conPassword"
              label="Confirm Password"
              name="conPassword"
              type="password"
              autoComplete="email"
              autoFocus
            /> */}

            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            {/* <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "secondary.main" }}
            >
              Submit
            </Button> */}
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
      </Container>
    </>
  )
}
