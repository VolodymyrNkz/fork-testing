import type { RefCallback } from 'react';
import { useCallback, useEffect, useRef } from 'react';

export const useIntersect = <T extends HTMLElement>(
  callback: IntersectionObserverCallback,
  cleanupCallback: () => void = () => {},
  options?: Omit<IntersectionObserverInit, 'root'> & { root?: 'body' | 'document' | HTMLElement },
): RefCallback<T | null> => {
  const callbackRef = useRef(callback);
  const cleanupCallbackRef = useRef(cleanupCallback);
  const cleanupRef = useRef<(() => void) | null>();

  useEffect(() => {
    callbackRef.current = callback;
    cleanupCallbackRef.current = cleanupCallback;
  });

  return useCallback(
    (el: T | null) => {
      cleanupRef.current?.();

      if (!el) return;

      const ElementsMap = {
        body: document.body,
        document,
      };

      const observer = new IntersectionObserver(callbackRef.current, {
        root:
          typeof options?.root === 'string'
            ? ElementsMap[options?.root]
            : options?.root || document,
        rootMargin: options?.rootMargin || '0px 0px 0px 0px',
        threshold: options?.threshold || 0,
      });
      observer.observe(el);

      cleanupRef.current = () => {
        cleanupCallbackRef.current?.();
        observer.disconnect();
      };
    },
    [options],
  );
};
