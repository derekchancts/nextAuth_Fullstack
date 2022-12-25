import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from "next/router";
import cookie from 'js-cookie';
import { parseCookies } from "nookies";
import { useSession, signIn, signOut, getSession, getCsrfToken, getProviders } from "next-auth/react"
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
  Container
} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import Image from 'next/image'
import dipper from '../../../assets/pic/dipper.png'
import { toast } from "react-toastify";

import { MyGoogleLoginButton } from '../../../utils/GoogleIconButton'



const Login = ({ csrfToken, providers }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  useEffect(() => {
    const cookies = parseCookies();
    // const user = cookies?.user ? JSON.parse(cookies.user) : session?.user ? session.user : "" ;
    const user = cookies?.user ? JSON.parse(cookies.user) : "";
    if (user) {
      router.push("/")
    }
  }, [router])


  const resetInputValues = () => {
    setEmail('');
    setPassword('');
  };


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // console.log(email, password)

    if (!email || !password) {
      // alert('all fields must not be empty')
      toast.error('all fields must not be empty', {
        background: '#EE0022 !important',
        // icon: "🤯"
        icon: (
          <Image
            src={dipper}
            alt="Login"
            width={30}
            height={30}
          />
         )
      })
      return
    };

    try {
      let config = { headers: { "Content-Type": "application/json" } };

      let newUser = { email, password };

      // const { data } = await axios.post('http://localhost:3500/users', newUser, config);
      const { data } = await axios.post('/api/user/login', newUser, config);
      if (data) console.log({ data })

      if (data.error) console.log({ "Some Error": data.error })


      if (data && !data.error) {
        cookie.set('token', data.token);
        cookie.set('user', JSON.stringify(data.user));  // need to stringify the object before we can save it as a string in a cookie

        // toast.success('login successfully')
        router.push('/')
      };
    } catch (error) {
      // console.log(error)    
      console.log(error?.response?.data?.error)
      toast.error(error?.response?.data?.error)
    }
    resetInputValues();
  };


  return (
    // <div>
    //   <h1>Login</h1>

    // <button onClick={() => signIn()}>Sign in with Google</button> 

    //    {Object.values(providers).map((provider) => {
    //     if (provider.name === "Email" || provider.name === "Credentials")
    //       return;

    //     return (
    //       <div key={provider.name}>
    //         <button onClick={() => signIn(provider.id)}>
    //           Sign in with {provider.name}
    //         </button>
    //       </div>
    //     );
    //   })}

    //   <form onSubmit={onSubmitHandler}>
    //     <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

    //     <label htmlFor="email">Email</label>
    //     <input
    //       type="text"
    //       id='email'
    //       name='email'
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //     <label htmlFor="password">Password</label>
    //     <input
    //       type="password"
    //       id='password'
    //       name='password'
    //       autoComplete='false'
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //     <button type='submit'>Submit</button>
    //   </form>

    // </div> 


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
          {/* <LoginIcon /> */}
          <Image
            src={dipper}
            alt="Login"
            width={50}
            height={50}
          />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <Grid
            container
            sx={{
              // mt: 2,
              // mb: 2,
              my: 2,
              border: 1,
              borderRadius: 1,
              borderColor: "grey.400",
              // '&:hover': {
              //   background: "rgb(7, 177, 77, 0.42)",          
              // }
            }}
          >
            {/* <GoogleLoginButton onClick={() => signIn("google")} /> */}
            <MyGoogleLoginButton onClick={() => signIn("google")} />
          </Grid>

        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={onSubmitHandler}
        >

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                // margin="normal"
                // sx={{ marginY: '10px' }}
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                // margin="normal"
                // sx={{ marginY: '10px' }}
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>

            {/* <Grid item xs={12}
                // container
                sx={{
                  maxWidth: '100%'
                }}
              >
                <GoogleLoginButton onClick={() => signIn("google")} />
            </Grid> */}
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2, backgroundColor: "primary.main" }}
          >
            Sign In
          </Button>

          <Grid container>
            <Grid item xs>
              <Link href="/src/user/forget" variant="body2" style={{ textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/src/user/register" variant="body2" passHref style={{ textDecoration: 'none' }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>

        </Box>
      </Box>
    </Container>

  )
}
export default Login




export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  if (session) {
    // Signed in
    return {
      redirect: { destination: "/" },
    };
  }

  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();

  return {
    props: { csrfToken, providers },
  };
}