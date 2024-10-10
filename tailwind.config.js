/** @type {import('tailwindcss').Config} */
import colors, { emerald } from "tailwindcss/colors"
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
    
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    colors: {
        dark:"#565656",
        greenOne:"#4ae594",
        greenTwo:"#14ae5c",
        greenThree:"#326a4d",
        slate:colors.slate,
        green:colors.green,
        red:colors.red,
        emerald: colors.emerald,
        error: "#ef4444",
        ghost:"#e4e4e7"
      },
    extend: {},
  },
  plugins: [
    daisyui,
  ],
}


