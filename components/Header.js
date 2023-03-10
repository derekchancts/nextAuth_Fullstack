import styles from './Header.module.css'
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';

import { parseCookies } from "nookies";
import cookie from 'js-cookie';
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

import { useDispatch, useSelector } from "react-redux";
import { setUser, authFetch, logoutUser, selectCurrentUser } from '../store/authSlice'
import { clearPosts } from '../store/postsSlice'

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';



export default function ButtonAppBar() {
  const dispatch = useDispatch(); 

  const router = useRouter();
  const [currentUser, setcurrentUser] = useState('');
  // console.log({ currentUser })

  const [isActive, setIsActive] = useState(false);

  const { data: session } = useSession();
  // console.log({session})

  const cookies = parseCookies();
  // console.log({ cookies })

  const theme = useTheme()
  let xsmallbreakPoint = useMediaQuery(theme.breakpoints.up('sm'));
  let xxsmallbreakPoint = useMediaQuery(theme.breakpoints.down('sm'));


  useEffect(() => {
    //! check and see if we have a cookie or a session
    const user = cookies?.user ? JSON.parse(cookies.user) : session?.user ? session.user : "";

    //! if we have a user, then call "authFetch"
    if (user && user !== 'undefined' && user !== null) dispatch(authFetch(user))
    
    setcurrentUser(user)
  }, [cookies.user, session, dispatch])



  const logoutHandler = () => {
    if (session) signOut()
    
    cookie.remove('token');
    cookie.remove('user');

    // LOGIC HERE TO UPDATE REDUX STATE
    dispatch(logoutUser());
    dispatch(clearPosts());

    router.push('/src/user/login')
  };



  const handleClick = e => {
    setIsActive(current => !current);
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

          <IconButton
            size="large"
            edge="start"
            // color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Link href="/" passHref>
              <HomeIcon sx={{ color: "white" }} />
            </Link>
          </IconButton>

          {/* {xsmallbreakPoint && (
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {currentUser && <p> user: {currentUser.name} </p>}
            </Typography>
          )}         */}

        {xxsmallbreakPoint && (
          //  <div className={`${styles.menuToggle} ${isActive ? `${styles.bgYellow}`: ''}`}  onClick={handleClick}>
           <div className={`${styles.menuToggle}`} onClick={() => setIsActive(current => !current)}>
            <span className={`${styles.bar} ${isActive ? `${styles.line1}`: ''}` }></span>
            <span className={`${styles.bar} ${isActive ? `${styles.line2}`: ''}`}></span>
            <span className={`${styles.bar} ${isActive ? `${styles.line3}`: ''}`}></span>
          </div>
        )}


      {xxsmallbreakPoint && currentUser && (    
        // <ul className={`${styles.navMenZu} ${isActive ? `${styles.showMenu}` : ''} ` }>
        <ul className={`${styles.navMenu} ${isActive ? `${styles['show-menu']}` : ''} ` }>
          <li><Link href="/" passHref className={styles.navLinks}>Home</Link></li>
          <li><Link href="/src/posts/posts" passHref className={styles.navLinks}>Posts</Link></li>
          <li><Link href="/src/posts/addpost"className={styles.navLinks}>Add Post</Link></li>
          <li><Link href="#" onClick={() => logoutHandler()} className={styles.navLinks}>Logout</Link></li>
        </ul>  
      )}


      {xxsmallbreakPoint && !currentUser && (
        <ul className={`${styles.navMenu} ${isActive ? `${styles['show-menu']}` : ''} ` }>
          <li><Link href="/src/user/login" passHref className={styles.navLinks}>Login</Link></li>
          <li><Link href="/src/user/register" passHref className={styles.navLinks}>Register</Link></li>
        </ul>
       )}

        

        {xsmallbreakPoint && (
          <>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {currentUser && <p> user: {currentUser.name} </p>}
          </Typography> 

          <Box sx={{ ml: 2, flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {currentUser ? (
              <>
                <Link href="/src/posts/posts" passHref style={{ textDecoration: 'none' }} >
                  <Button sx={{ color: 'white'}}>Posts</Button>
                </Link>
                <Link href="/src/posts/addpost" passHref style={{ textDecoration: 'none' }}>
                  <Button sx={{ color: 'white'}}>Add Post</Button>
                </Link>
                <Button color="inherit" onClick={() => logoutHandler()}>Logout</Button>
              </>
            ) : (
              <>
                <Link href="/src/user/login" passHref style={{ textDecoration: 'none' }} >
                  <Button sx={{ color: 'white'}}>Login</Button>
                </Link>
                <Link href="/src/user/register" passHref style={{ textDecoration: 'none' }}>
                  <Button sx={{ color: 'white'}}>Register</Button>
                </Link>
              </>
            )}
          </Box>

          </>
        )}

        </Toolbar>
      </AppBar>
    </Box>
  );
}