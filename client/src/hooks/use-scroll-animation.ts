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
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    const animatedElements = element.querySelectorAll('.scroll-animate');
    
    // Check if elements are already in view on initial load
    const checkInitialVisibility = () => {
      animatedElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // If element is in viewport on initial load, add in-view class immediately
        if (rect.top < windowHeight && rect.bottom > 0) {
          el.classList.add('in-view');
        }
        
        observer.observe(el);
      });
    };

    // Use a small delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(checkInitialVisibility, 100);

    return () => {
      clearTimeout(timeoutId);
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return ref;
}