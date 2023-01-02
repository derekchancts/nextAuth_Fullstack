import { parseCookies } from "nookies"
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';


const AuthWrapper = ({ children }) => {
  const cookies = parseCookies()
  const router = useRouter()
  const { data: session, status } = useSession()

  // console.log({session})
  // console.log({status})

  const user = cookies?.user ? JSON.parse(cookies.user) : session?.user ? session.user : "";
  // console.log({user})

  useEffect(() => {
    if (!user) router.push("/src/user/login")
  }, [user, router])


  // if (!session && !user) {
  if (status !== "authenticated" && !user) {
  // if (status !== "authenticated" ) {
    // return <h2>Loading...</h2>;
    return (
      <>
        <Box
          sx={{ 
            display: "flex" ,
            width: '95vw' ,
            height: '90vh' ,
            // height: '500px',
            // width: '500px',
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: "lightblue"
          }}
        >
          <CircularProgress size={100}/>
        </Box>
      </>
    )
  };

  return (
    <>
      {children}
    </>
  )
};



export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session
    },
  };
}



export default AuthWrapper
