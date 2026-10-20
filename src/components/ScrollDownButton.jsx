import { useEffect, useState } from "react";
import styles from "../styles/style";
export default function ScrollDownButton({text="↓ Scroll for more",onClick,onBottomClick,visible=true}) {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    const handleScroll = () => {
      if(document && document.body){
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      setIsVisible(!nearBottom);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return isVisible ? (
    <button
      onClick={onClick?onClick:scrollToBottom}
      className={styles.scrollDown.button}
      >
      
      {text}
    </button>
  ) : null;
}
