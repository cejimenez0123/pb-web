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
      'page':"45em",
        'page-content':"44.8em",
        'page-mobile':"97.6vw",
        'page-mobile-content':"95vw",
      'info':"55rem",
      'grid':"31.6vw",
      'grid-content':"31.5vw",
      'grid-mobile':"48.6vw",
      'grid-mobile-content':"45.8vw"

    },
    height:{
      "info":"18rem",
      "item":"20rem",
      "page":"47rem",
      'page-content':"30rem",
      "page-mobile":"27em",
      'grid-mobile':"15rem",
      "page-mobile-content":"26.56em",
      "grid-mobile-content":"15rem",
      'grid':"33rem",
      'grid-content':"30rem",
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


