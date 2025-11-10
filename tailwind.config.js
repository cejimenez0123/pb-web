/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors"
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
        'page-content':"49.8em",
        'page-mobile':"97vw",
        'page-mobile-content':"95vw",
      'info':"55rem",
      'grid':"31.6vw",
      'grid-content':"31vw",
      'grid-mobile':"48.6vw",
      'grid-mobile-content':"45.8vw"

    },
    colors:{
      ...colors,
      "blueSea":"#0097b2",
      "soft":"#40906f",
      "golden":"#f85e30",
      "cream":"#f4f4e0"
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
      'grid':"35rem",
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


