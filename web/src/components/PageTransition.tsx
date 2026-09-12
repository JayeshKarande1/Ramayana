'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Trigger quick golden navigation feedback line on route change
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 280);

    // Scroll to top smoothly unless anchor hash is present
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo(0, 0);
    }

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Top Edge Golden Route Progress Indicator */}
      <div 
        className={`fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none transition-all duration-300 ${
          isNavigating ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div 
          className={`h-full saffron-gradient shadow-[0_0_10px_rgba(245,158,58,0.8)] transition-all duration-300 ${
            isNavigating ? 'w-full ease-out' : 'w-0'
          }`} 
        />
      </div>

      {/* Main Transition Page Container */}
      <div key={pathname} className="animate-page-enter w-full flex-1 flex flex-col">
        {children}
      </div>
    </>
  );
}
