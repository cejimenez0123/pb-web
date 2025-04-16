/** @type {import('tailwindcss').Config} */
import colors, { emerald } from "tailwindcss/colors"
import daisyui from "daisyui"

export default {

  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx}",
  ],


  theme: {
    width: {
      '128': '48rem',
      'page':"50em",
      'info':"55rem",
      'grid':"36em",
      'grid-content':"35.5em",
      'grid-mobile':"13em",
       'grid-mobile-content':"12em"

    },
    height:{
      "info":"18rem",
      "item":"20rem",
      "page":"55em"
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
    extend: { keyframes: {
      shine: {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(100%)' },
      },
    },
    animation: {
      shine: 'shine 1s ease-in-out',
      
      'fade-out': 'fadeOut 4s ease-out forwards',
    },
    keyframes: {
      fadeOut: {
        '0%': { opacity: 1 ,
          display:"content"
        },
        '100%': { opacity: 0,
          display:"hidden"
         
         },
      
      },
    },
  },
  },
  plugins: [
    daisyui,
  ],
}


