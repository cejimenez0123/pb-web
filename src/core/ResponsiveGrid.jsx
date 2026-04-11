import { useEffect, useState } from "react";

function getGridConfig() {
  const width = window.innerWidth;

  // 📱 phones
  if (width < 640) {
    return { columns: 1, rows: 3 };
  }

  // 📱 large phones / small tablets
  if (width < 820) {
    return { columns: 2, rows: 3 };
  }

  // 📱 iPad Air range (IMPORTANT ZONE)
  if (width >= 820 && width <= 1024) {
    return { columns: 4, rows: 2 }; // 👉 8 items
  }

  // 💻 desktop
  if (width > 1024 && width < 1440) {
    return { columns: 3, rows: 3 };
  }

  // 🖥 large desktop
  return { columns: 4, rows: 3 };
}

export function useResponsiveGrid() {
  const [config, setConfig] = useState(getGridConfig());

  useEffect(() => {
    const onResize = () => setConfig(getGridConfig());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return config;
}