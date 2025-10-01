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
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Function to initialize scroll animations
    const initializeElements = () => {
      const animatedElements = element.querySelectorAll('.scroll-animate');
      
      animatedElements.forEach((el) => {
        // Check if element is already in viewport on load
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight - 100) {
          el.classList.add('in-view');
        }
        
        // Start observing for future scroll events
        observer.observe(el);
      });
    };

    // Monitor for new elements being added to DOM (for dynamic content)
    const mutationObserver = new MutationObserver((mutations) => {
      let hasNewElements = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const nodeElement = node as Element;
              if (nodeElement.classList?.contains('scroll-animate') || 
                  nodeElement.querySelector?.('.scroll-animate')) {
                hasNewElements = true;
              }
            }
          });
        }
      });
      
      if (hasNewElements) {
        setTimeout(initializeElements, 100);
      }
    });

    // Start observing DOM changes
    mutationObserver.observe(element, {
      childList: true,
      subtree: true
    });

    // Initialize immediately
    initializeElements();
    
    // Retry initialization for dynamic content
    const retryTimeouts = [300, 800, 1500];
    retryTimeouts.forEach(delay => {
      setTimeout(initializeElements, delay);
    });

    return () => {
      mutationObserver.disconnect();
      const animatedElements = element.querySelectorAll('.scroll-animate');
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return ref;
}