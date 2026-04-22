/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors"
import daisyui from "daisyui"


export default {

  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx}",
  ],

  
  theme: {
  
    // maxWidth:{
    //     'page':"50em"
    // },
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
      "cream":"#f4f4e0",
      
    "base": {
      "bg":"#f8f6f1", // App background (main canvas, warm cream)
      "surface": "#f4f4e0", // Cards, modals, sheets (elevated surfaces)
      "soft": "#40906f" // Brand base tone (used for highlights, accents)
    },

    "text": {
      "dark":"#ffffff",
      "primary": "#1f2937", // Main readable text (titles, body)
      "secondary": "#6b7280", // Subtext, metadata, timestamps
      "inverse": "#ffffff", // Text on dark buttons/backgrounds
      "brand": "#40906f" // Links, emphasized brand text
    },

    "button": {
      "primary": {
        "bg": "#40906f", // Main CTA (Save, Add, Publish)
        "text": "#ffffff", // Text on primary button
        "hover": "#347a5e" // Hover/pressed state
      },
      "secondary": {
        "bg": "#0097b2", // Secondary actions (View, Navigate)
        "text": "#ffffff",
        "hover": "#007c92"
      },
      "accent": {
        "bg": "#ffde59", // Highlight actions (Explore, Discover)
        "text": "#1f2937",
        "hover": "#e6c94f"
      },
      "danger": {
        "bg": "#d62d15", // Destructive actions (Delete)
        "text": "#ffffff",
        "hover": "#b62511"
      }
    },

    "card": {
      "background": "#ffffff", // Card background
      "border": "#e5e7eb", // Subtle card border
      "highlight": "#7ed957" // Selected/active card accent
    },

    "border": {
      "default": "#e5e7eb", // Standard borders/dividers
      "soft": "#d1d5db", // Lighter borders (inputs, subtle UI)
      "focus": "#40906f" // Focus state (inputs, selected elements)
    },

    "shadow": {
      "sm": "rgba(0,0,0,0.05)", // Small cards
      "md": "rgba(0,0,0,0.08)", // Floating elements
      "lg": "rgba(0,0,0,0.12)" // Modals, overlays
    },

    "accent": {
      "blue": "#0097b2", // Navigation, links, secondary emphasis
      "purple": "#9b67b6", // Depth, hierarchy, creative elements
      "pink": "#e96fbd", // Emotional highlights, reactions
      "orange": "#f85e30" // Energy, alerts, strong emphasis
    },

    "tag": {
      "green": "#7ed957", // Positive tags, growth, success
      "blue": "#598ec8", // Informational tags
      "purple": "#a9a1d4", // Creative categories
      "earth": "#c28558" // Grounded, neutral tags
    },

    "states": {
      "success": "#7ed957", // Success messages, confirmations
      "warning": "#ff914d", // Warnings, caution states
      "error": "#d62d15", // Errors, destructive feedback
      "info": "#0097b2" // Informational messages
    },
      "softBlue":"#bae6fe",
      "blueSea":"#0097b2",
      "soft":"#40906f",
      "golden":"#f85e30",
        "border-default": "#e5e7eb",
"border-soft": "#d1d5db",
"border-focus": "#40906f",
teal:"#007c92",
  "blue": "#0097b2", // Navigation, links, secondary emphasis
      "purple": "#9b67b6", // Depth, hierarchy, creative elements
      "pink": "#e96fbd", // Emotional highlights, reactions
      "orange": "#f85e30" ,// Energy, alerts, strong emphasis
        "green": "#7ed957", // Positive tags, growth, success
      "info-blue": "#598ec8", // Informational tags
      "purple": "#a9a1d4", // Creative categories
      "earth": "#c28558" // Grounded, neutral tags
      // "cream":"#f8f6f1"
      // "#f4f4e0"
    },

    height:{
      "info":"18rem",
      "item":"20rem",
      "page":"50rem",
      'page-content':"30rem",
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


