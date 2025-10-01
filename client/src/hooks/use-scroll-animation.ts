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
            // Optional: Remove in-view when element leaves viewport
            entry.target.classList.remove('in-view');
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const animatedElements = element.querySelectorAll('.scroll-animate');
    
    // Add in-view class to elements already visible, observe all elements
    const initializeElements = () => {
      animatedElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // If element is in viewport on initial load, add in-view class immediately
        if (rect.top < windowHeight - 50 && rect.bottom > 50) {
          el.classList.add('in-view');
        }
        
        observer.observe(el);
      });
    };

    // Initialize immediately
    initializeElements();

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return ref;
}