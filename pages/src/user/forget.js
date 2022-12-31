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
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox"

import axios from "axios"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import Link from "next/link";


const Forget = () => {
  const router = useRouter()

  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = new FormData(e.currentTarget)  // grabs the form
    // console.log(e.currentTarget)  // grab the form
    
    try {
      const email = result.get("email")
      // console.log({email})

      let config = { headers: { "Content-Type": "application/json" } };

      const { data } = await axios.post(`/api/user/forget`, { email }, config)

      // const res = await fetch('/api/user/forget', { 
      //   method: 'POST', 
      //   body: JSON.stringify({ email }),
      //   headers: {'Content-Type': 'application/json'}
      // });

      // const data = await res.json();


      if (data.error) console.log({ "Some Error": data.error })

      if (data && !data.error) {
        toast.success(data.success)
        router.push("/src/user/login")
      };

    } catch (error) {
      console.log(error.response)
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

          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <ForwardToInboxIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Email Reset Link
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: "primary.main" }}
              >
                Submit
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="/src/user/login" variant="body2" style={{ textDecoration: 'none', fontSize: '.95rem' }}>
                    Have an account ? Login
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/src/user/register" variant="body2" style={{ textDecoration: 'none', fontSize: '.95rem' }}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>

            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  )
}


export default Forget