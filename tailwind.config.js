/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors"
import daisyui from "daisyui"

export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],


  theme: {
    width: {
      '128': '48rem',
    },
    colors: {
        dark:"#565656",
        greenOne:"#4ae594",
        greenTwo:"#14ae5c",
        greenThree:"#326a4d",
        slate:colors.slate
      },
    extend: {},
  },
  plugins: [
    daisyui,
  ],
}


