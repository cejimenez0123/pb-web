import { useState,useEffect } from "react";
import { initGA,sendGAEvent } from "./ga4";
const useScrollTracking = ({name=""}) => {
    const [scrollDepth, setScrollDepth] = useState(0);
  
    useEffect(() => {
      initGA()
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const totalScroll = scrollTop + windowHeight;
        const scrollPercent = (totalScroll / docHeight) * 100;
  
        // Trigger events at specific scroll depths
        if (scrollPercent >= 25 && scrollDepth < 25) {
        sendGAEvent( 'Scroll '+window.location.pathname+window.location.search, 'Scrolled 25% '+name, 'Scroll Depth');
          setScrollDepth(25);
        } else if (scrollPercent >= 50 && scrollDepth < 50) {
    
          sendGAEvent( 'Scroll '+window.location.pathname+window.location.search, 'Scrolled 50% '+name, 'Scroll Depth');

          setScrollDepth(50);
        } else if (scrollPercent >= 75 && scrollDepth < 75) {
          sendGAEvent( 'Scroll '+window.location.pathname+window.location.search, 'Scrolled 75%'+name, 'Scroll Depth');
       
          setScrollDepth(75);
        } else if (scrollPercent >= 100 && scrollDepth < 100) {
          sendGAEvent( 'Scroll '+window.location.pathname+window.location.search, 'Scrolled 100%', 'Scroll Depth');
      
          setScrollDepth(100);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollDepth]);
  };
export default useScrollTracking