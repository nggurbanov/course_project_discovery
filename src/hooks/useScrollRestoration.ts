import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SCROLL_STORAGE_KEY = 'coursework_scroll_position';

/**
 * Hook to save and restore scroll position when navigating.
 * @param isReady - A boolean flag that should be true only when the page content is fully rendered.
 */
export const useScrollRestoration = (isReady: boolean) => {
  const location = useLocation();

  // Save scroll position before navigating away
  useEffect(() => {
    const saveScrollPosition = () => {
      const scrollPosition = {
        x: window.scrollX,
        y: window.scrollY,
        path: location.pathname
      };
      sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(scrollPosition));
    };

    // Save scroll position when navigating away
    window.addEventListener('beforeunload', saveScrollPosition);

    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
      // Save scroll position when component unmounts (navigation)
      saveScrollPosition();
    };
  }, [location.pathname]);

  // Restore scroll position when returning to a page and content is ready
  useEffect(() => {
    // Only attempt to restore when the page content is ready
    if (!isReady) {
      return;
    }

    try {
      const saved = sessionStorage.getItem(SCROLL_STORAGE_KEY);
      if (saved) {
        const scrollPosition = JSON.parse(saved);
        
        // Only restore if we're returning to the same path
        if (scrollPosition.path === location.pathname) {
          const attemptScroll = () => {
            window.scrollTo({
              top: scrollPosition.y,
              left: scrollPosition.x,
              behavior: 'instant' as ScrollBehavior,
            });
          };
          
          // Attempt scrolling immediately and again after a short delay to ensure it sticks
          requestAnimationFrame(attemptScroll);
          setTimeout(attemptScroll, 50);
        }
      }
    } catch (error) {
      console.error('Error restoring scroll position:', error);
    }
  }, [location.pathname, isReady]);
};

