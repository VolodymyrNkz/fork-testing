import { useState, useEffect, useRef } from 'react';

export const useFloating = () => {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const setTargetRef = (element: HTMLDivElement | null) => {
    if (targetRef.current) {
      observerRef.current?.unobserve(targetRef.current);
    }

    if (element) {
      observerRef.current?.observe(element);
    }

    targetRef.current = element;
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 1.0 },
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const styles = {
    floatingWrapper:
      'left-0 bottom-0 w-full px-lg py-md fixed border-t border-disabled bg-white  z-[30] opacity-0 translate-y-0 transition-all duration-300 ease-in-out',
    visible: 'opacity-100 translate-y-0',
    invisible: 'opacity-0 translate-y-full',
  };

  return { ref: targetRef, isVisible, styles, setTargetRef };
};
