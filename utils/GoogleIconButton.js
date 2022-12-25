import { GoogleLoginButton, createButton, createSvgIcon } from "react-social-login-buttons"
import { SiGoogle } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";


// const config = {
//   text: "Log in with Google",
//   icon: "google",
//   iconFormat: name => `fa fa-${name}`,
//   style: { background: "#3b5998" },
//   activeStyle: { background: "#293e69" }
// };

// const MyGoogleLoginButton = createButton(config);

const config = {
  text: "Log in with Google",
  icon: createSvgIcon(FcGoogle),
  iconFormat: name => `fa fa-${name}`,
  // style: { background: "#2196f3", display: 'flex', justifyContent: 'center', },
  style: { background: "#fff", color: '#000', display: 'flex', justifyContent: 'center', },
  // activeStyle: { background: "#2d82b7" }
  activeStyle: { background: "#eee" }
};


export const MyGoogleLoginButton = createButton(config);
