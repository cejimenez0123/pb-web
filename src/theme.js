import { createTheme } from "@mui/material/styles";
import { green, blue,purple } from '@mui/material/colors'
let theme = createTheme({
    palette:{
        primary: {
            main: green[900],
          },
          secondary: {
            main: blue[900],
          },
          info:{
            main: "rgb(1,1,1,0",
            disabled: "rgb(44,44,44)",
            contrastText: "rgb(244,244,244)"
          }
    }
})
export default theme