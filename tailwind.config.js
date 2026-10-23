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
      
        'page-mobile':"97vw",
        'page-mobile-content':"95vw",
      'info':"55rem",
      'grid':"31.6vw",
      'grid-content':"31vw",
      'grid-mobile':"48.6vw",
      'grid-mobile-content':"45.8vw",

  // New standardized widths
  'content-narrow': '31rem',
  'content-standard': '48rem',
  'content-wide': '55rem',

  // Page layout
  'page-max': '50em',
  'page-fluid': '97vw',
  'page-content-fluid': '95vw',

  // Grid layout
  'grid-column': '31.6vw',
  'grid-column-content': '31vw',
  'grid-column-mobile': '48.6vw',
  'grid-column-mobile-content': '45.8vw',
    },
    colors: {
  ...colors,

  plumb: {
    // Core surfaces
   // Core surfaces — preserve the existing design
paper: "#f4f4e0",
canvas: "#f8f6f1",
surface: "#eeeeda",
elevated: "#fffef5",

// Dark surfaces
dark: {
  canvas:"#2c342e",
  //  "#171c19",
  paper: "#1d231f",
  surface: "#252c27",
  elevated: "#171c19",
},

// Typography
ink: "#12261f",
text: "#1f2937",
muted: "#505950",
subtle: "#626b62",

darkText: "#f3f1df",
darkMuted: "#c4cbbf",
darkSubtle: "#adb5a9",

// Brand
mint: "#40906f",
mintHover: "#347a5e",
mintLight: "#8fd8b5",

coral: "#F06449",
coralHover: "#D94D35",
coralLight: "#FF8A70",

// Borders and dividers
line: "#b8b19b",
border: "#c5bea8",
borderStrong: "#898873",

darkLine: "#59645a",
darkBorder: "#505c52",
darkBorderStrong: "#68766a",

// Focus
focus: "#8fd8b5",
focusLight: "#347a5e",


    // Buttons
    button: {
      primary: {
        bg: "#40906f",
        text: "#ffffff",
        hover: "#347a5e",
      },

      secondary: {
        bg: "#0097b2",
        text: "#ffffff",
        hover: "#007c92",
      },

      accent: {
        bg: "#ffde59",
        text: "#12261f",
        hover: "#e6c94f",
      },

      danger: {
        bg: "#d62d15",
        text: "#ffffff",
        hover: "#b62511",
      },
    },

    // Supporting colors
    accent: {
      blue: "#0097b2",
      purple: "#8d6aaa",
      pink: "#d967ad",
      orange: "#e85d32",
      yellow: "#ffde59",
    },

    // Tags / categories
    tag: {
      green: "#4f9d69",
      blue: "#598ec8",
      purple: "#8d7fba",
      earth: "#b8784e",
    },

    // System states
    states: {
      success: "#4f9d69",
      warning: "#b86b16",
      error: "#c93620",
      info: "#4d8fb0",
    },

    // Focus
    focus: "#8fd8b5",
  },
},

    height:{
      "info":"18rem",
      "item":"20rem",
      "page":"50rem",
      // 'page-content':"30rem",
      "page-mobile":"27em",
      'grid-mobile':"15rem",
      "page-mobile-content":"26.56em",
      "grid-mobile-content":"15rem",
      'grid':"35rem",
      'grid-content':"30rem",
      "button":"calc(var(--spacing) * 10)"
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
    extend: { 
      keyframes: {
        fadeOut: {
        '0%': { opacity: 1 ,
          display:"content"
        },
        '100%': { opacity: 0,
          display:"hidden"
         
         },
      
      },
      shine: {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(100%)' },
      },
    },
    animation: {
      shine: 'shine 1s ease-in-out',
      
      'fade-out': 'fadeOut 4s ease-out forwards',
    },
 
  },
  },
  plugins: [
    daisyui,
  ],
}


