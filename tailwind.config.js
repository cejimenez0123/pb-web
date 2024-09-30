/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"

export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],


  theme: {
    colors: {
        dark:"#565656",
        greenOne:"#4ae594",
        greenTwo:"#14ae5c",
        greenThree:"#326a4d"
      },
    extend: {},
  },
  plugins: [
    daisyui,
  ],
}


