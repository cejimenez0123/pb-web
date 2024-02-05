import { createTheme } from "@mui/material/styles";
import { green, blue } from '@mui/material/colors'
let theme = createTheme({
    palette:{
        primary: {
            main: green[900],
            dark:'#1A5638',
            light: green[200],
            extraLight:green[100],
            contrastText: "rgb(244,244,244)"
          },
          secondary: {
            main: "#1B2F5E",
            dark:"#72788D",
            light: blue[200]
          },
          info:{
            main: "rgb(1,1,1,0)",
            disabled: "rgb(44,44,44)",
            contrastText: "rgb(244,244,244)",
            neutralText: "#808080"
          }
    },
    attributes:{
      boxShadow:`0 1px 1px hsl(0deg 0% 0% / 0.075),
      0 2px 2px hsl(0deg 0% 0% / 0.075),
      0 4px 4px hsl(0deg 0% 0% / 0.075),
      0 8px 8px hsl(0deg 0% 0% / 0.075),
      0 16px 16px hsl(0deg 0% 0% / 0.075)`
    }
})
export default theme