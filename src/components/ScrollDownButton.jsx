import { useEffect, useState } from "react";

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
      className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 "
    >
      {/* ↓ Scroll for more */}
      {text}
    </button>
  ) : null;
}
