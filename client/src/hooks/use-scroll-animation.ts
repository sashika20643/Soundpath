import { useEffect, useRef } from 'react';

export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            // Only remove in-view for elements below the fold to prevent flickering
            const rect = entry.target.getBoundingClientRect();
            if (rect.top > window.innerHeight) {
              entry.target.classList.remove('in-view');
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '100px 0px -50px 0px',
      }
    );

    const animatedElements = element.querySelectorAll('.scroll-animate');
    
    // Initialize elements and check visibility
    const initializeElements = () => {
      animatedElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // More liberal initial visibility check
        if (rect.top < windowHeight && rect.bottom > 0) {
          el.classList.add('in-view');
        }
        
        observer.observe(el);
      });
    };

    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      initializeElements();
    });

    // Also check after a brief delay to catch any dynamically loaded content
    const timeoutId = setTimeout(() => {
      const newElements = element.querySelectorAll('.scroll-animate:not(.in-view)');
      newElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight && rect.bottom > 0) {
          el.classList.add('in-view');
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return ref;
}