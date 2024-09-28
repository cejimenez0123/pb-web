import ReactGA from "react-ga4";
import { useState,useEffect } from "react";
const useScrollTracking = () => {
    const [scrollDepth, setScrollDepth] = useState(0);
  
    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const totalScroll = scrollTop + windowHeight;
        const scrollPercent = (totalScroll / docHeight) * 100;
  
        // Trigger events at specific scroll depths
        if (scrollPercent >= 25 && scrollDepth < 25) {
          ReactGA.event({
            category: 'Scroll '+window.location.pathname+window.location.search,
            action: 'Scrolled 25%',
            label: 'Scroll Depth'
          });
          setScrollDepth(25);
        } else if (scrollPercent >= 50 && scrollDepth < 50) {
          ReactGA.event({
            category: 'Scroll '+window.location.pathname+window.location.search,
            action: 'Scrolled 50%',
            label: 'Scroll Depth'
          });
          setScrollDepth(50);
        } else if (scrollPercent >= 75 && scrollDepth < 75) {
          ReactGA.event({
            category: 'Scroll '+window.location.pathname+window.location.search,
            action: 'Scrolled 75%',
            label: 'Scroll Depth'
          });
          setScrollDepth(75);
        } else if (scrollPercent >= 100 && scrollDepth < 100) {
          ReactGA.event({
            category: 'Scroll '+window.location.pathname+window.location.search,
            action: 'Scrolled 100%',
            label: 'Scroll Depth'
          });
          setScrollDepth(100);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollDepth]);
  };
export default useScrollTracking