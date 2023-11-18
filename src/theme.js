import { createTheme } from "@mui/material/styles";
import { green, blue } from '@mui/material/colors'
let theme = createTheme({
    palette:{
        primary: {
            main: green[900],
            dark:'#124116',
            light: green[200],
            contrastText: "rgb(244,244,244)"
          },
          secondary: {
            main: "#1B2F5E",
            light: blue[200]
          },
          info:{
            main: "rgb(1,1,1,0",
            disabled: "rgb(44,44,44)",
            contrastText: "rgb(244,244,244)"
          }
    }
})
export default theme