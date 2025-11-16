import { useEffect, useState } from 'react';

export function useResponsive() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    function onResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isXs = width < 576; // Bootstrap sm breakpoint
  const isSm = width >= 576 && width < 768;
  const isMd = width >= 768 && width < 992;
  const isLg = width >= 992 && width < 1200;
  const isXl = width >= 1200;

  // Base responsive height
  let plotHeight = isXs ? 300 : isSm ? 340 : isMd ? 400 : 480;

  // Override with Settings if present
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('appSettings') : null;
    if (raw) {
      const settings = JSON.parse(raw);
      if (settings && settings.chartHeight) {
        if (settings.chartHeight === 'small') plotHeight = 300;
        if (settings.chartHeight === 'medium') plotHeight = 480;
        if (settings.chartHeight === 'large') plotHeight = 600;
      }
    }
  } catch {}

  return { width, isXs, isSm, isMd, isLg, isXl, plotHeight };
}
