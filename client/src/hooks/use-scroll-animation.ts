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
            // Only remove in-view for elements that are far below the viewport
            const rect = entry.target.getBoundingClientRect();
            if (rect.top > window.innerHeight + 200) {
              entry.target.classList.remove('in-view');
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -100px 0px',
      }
    );

    // Function to check if element is in viewport
    const isInViewport = (el: Element) => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      return rect.top < windowHeight - 50 && rect.bottom > 50;
    };

    // Initialize elements
    const initializeElements = () => {
      const animatedElements = element.querySelectorAll('.scroll-animate');
      
      animatedElements.forEach((el) => {
        // Check initial visibility
        if (isInViewport(el)) {
          el.classList.add('in-view');
        }
        
        // Start observing all elements
        observer.observe(el);
      });
    };

    // Multiple initialization attempts to catch dynamic content
    const initializeWithRetries = () => {
      initializeElements();
      
      // Extended retry attempts for API-loaded content
      const timeouts = [100, 300, 500, 1000, 1500, 2000];
      timeouts.forEach(delay => {
        setTimeout(() => {
          const newElements = element.querySelectorAll('.scroll-animate:not(.in-view)');
          newElements.forEach((el) => {
            if (isInViewport(el)) {
              el.classList.add('in-view');
            }
          });
        }, delay);
      });
    };

    // Monitor for new elements being added to DOM
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldReinitialize = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.classList?.contains('scroll-animate') || 
                  element.querySelector?.('.scroll-animate')) {
                shouldReinitialize = true;
              }
            }
          });
        }
      });
      
      if (shouldReinitialize) {
        setTimeout(() => {
          initializeElements();
        }, 100);
      }
    });

    // Start observing DOM changes
    mutationObserver.observe(element, {
      childList: true,
      subtree: true
    });

    // Initialize immediately and after animation frame
    requestAnimationFrame(() => {
      initializeWithRetries();
    });

    // Also initialize after a brief delay for dynamic content
    const mainTimeout = setTimeout(() => {
      initializeWithRetries();
      // Mark scroll animations as ready after initial setup
      setTimeout(() => {
        element.classList.add('scroll-animation-ready');
      }, 500);
    }, 50);

    return () => {
      clearTimeout(mainTimeout);
      mutationObserver.disconnect();
      const animatedElements = element.querySelectorAll('.scroll-animate');
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return ref;
}