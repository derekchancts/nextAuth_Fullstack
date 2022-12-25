import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession, signIn, signOut, getSession, getCsrfToken, getProviders } from "next-auth/react"
import { parseCookies } from "nookies"
import { useRouter } from "next/router"
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
} from "@mui/material";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Image from 'next/image'
import wendy from '../../../assets/pic/wendy.png'
import { toast } from "react-toastify";

import { MyGoogleLoginButton } from '../../../utils/GoogleIconButton'



const Register = ({ csrfToken, providers }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")


  useEffect(() => {
    const cookies = parseCookies();
    // const user = cookies?.user ? JSON.parse(cookies.user) : session?.user ? session.user : "" ;
    const user = cookies?.user ? JSON.parse(cookies.user) : "";

    if (user) router.push("/");
  }, [router])


  const resetInputValues = () => {
    setFirstName('')
    setLastName('')
    setEmail('');
    setPassword('');
    setConPassword('');
  };


  const toastConfig = {
    background: '#EE0022 !important',
      // icon: "🤯"
      icon: (
        <Image
          src={wendy}
          alt="Login"
          width={30}
          height={30}
        />
      )
  };

  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // console.log(email, password)

    if (!firstName || !lastName || !email || !password) {
      toast.error('all fields must not be empty', toastConfig)
      return
    };

    if (password.length < 6) {
      toast.error('password must be at least 6 characters in length', toastConfig)
      return
    };

    if (password !== conPassword) {
      toast.error('passwords do not match!', toastConfig)
      return
    };

    try {
      let config = { headers: { "Content-Type": "application/json" } };

      let newUser = {
        // id: Math.random(),
        email,
        password,
        firstName,
        lastName
      };

      // const { data } = await axios.post('http://localhost:3500/users', newUser, config);
      const { data } = await axios.post('/api/user/register', newUser, config);
      // console.log({ data })

      if (data && !data.error) {
        setEmail("");
        setPassword("");
        setConPassword("");
        setFirstName("");
        setLastName("");

        toast.success(data.success);
        router.push('/src/user/login')
      }
    } catch (error) {
      // console.log(error)    
      console.log(error?.response?.data?.error)
      toast.error(error?.response?.data?.error)
    }

    resetInputValues();
  };


  return (
    // <div>
    //   <h1>Register</h1>

    //   <form onSubmit={onSubmitHandler}>
    //   <label htmlFor="firstName">First Name</label>
    //     <input
    //       type="text"
    //       id='firstName'
    //       name='firstName'
    //       value={firstName}
    //       onChange={(e) => setFirstName(e.target.value)}
    //     />
    //   <label htmlFor="lastName">Last Name</label>
    //     <input
    //       type="text"
    //       id='lastName'
    //       name='lastName'
    //       value={lastName}
    //       onChange={(e) => setLastName(e.target.value)}
    //     />
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
          {/* <AppRegistrationIcon /> */}
          <Image
            src={wendy}
            alt="Register"
            width={50}
            height={50}
          />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={onSubmitHandler}
          sx={{ mt: 3 }}
        >

          <Grid
            container
            sx={{
              // mt: 2,
              mb: 3,
              border: 1,
              borderRadius: 1,
              borderColor: "grey.400",
            }}
          >
            <MyGoogleLoginButton onClick={() => signIn("google")} >
              Sign up with Google
            </MyGoogleLoginButton>
            {/* <GoogleLogoutButton onClick={() => signIn("google")}/> */}
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                // margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                id="confirm password"
                autoComplete="current-password"
                value={conPassword}
                onChange={(e) => setConPassword(e.target.value)}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2, backgroundColor: "primary.main" }}
          >
            Sign Up
          </Button>

          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/src/user/login" variant="body2" passHref style={{ textDecoration: 'none' }}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>

        </Box>
      </Box>
    </Container>
  )
}

export default Register



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