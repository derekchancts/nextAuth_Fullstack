import { createTheme } from "@mui/material/styles"
import { red, blue, orange, green, purple } from "@mui/material/colors"


// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      // main: "#ffcd38",
      main: "#2196f3",
      // main: blue[500],
      light: '#757ce8',
      // main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      // main: "#ff3d00",
      // main: "#3d5afe",
      // main: "#02A9EA",
      // main: "#2d82b7",
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    error: {
      main: red.A400,
    },
    btn: {
      main: orange[900]
    },
    background: {
      default: "#fff",
      // default: "#000",
    },
  },
})

export default theme
