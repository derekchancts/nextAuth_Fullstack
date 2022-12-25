import React from "react"

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
} from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"

import { useRouter } from "next/router"
import axios from "axios"
import { toast } from "react-toastify"



export default function SignIn() {
  const router = useRouter()

  const { token } = router.query
  // console.log(token)

  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = new FormData(e.currentTarget)

    try {
      const password = result.get("password");
      const conPassword = result.get("conPassword");

      if (password.length < 6) {
        toast.error("password must be at least 6 characters in length")
        return
      };

      if (password !== conPassword) {
        toast.error("passwords do not match!")
        return
      };


      let config = { headers: { "Content-Type": "application/json" } };

      const { data } = await axios.put(
        `/api/user/reset/${token}`,
        { conPassword, password },
        config
      );
      toast.success(data.success);
      router.push('/src/user/login');

    } catch (error) {
      toast.error(error?.response?.data?.error)
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
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
            />

            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "secondary.main" }}
            >
              Submit
            </Button>
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
