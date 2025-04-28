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
      'page':"45.6em",
        'page-content':"45em",
        'page-mobile':"97.6vw",
        'page-mobile-content':"96vw",
      'info':"55rem",
      'grid':"32vw",
      'grid-content':"31.3vw",
      'grid-mobile':"48vw",
      'grid-mobile-content':"46.6vw"

    },
    height:{
      "info":"18rem",
      "item":"20rem",
      "page":"55em",
      'page-content':"40rem",
      "page-mobile":"33em",
      "page-mobile-content":"32.6em",
      "grid-mobile-content":"10rem",
      "grid":"20rem",
      "grid-content":"18rem",
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


