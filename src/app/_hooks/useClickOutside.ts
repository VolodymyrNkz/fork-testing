import { RefCallback, useCallback, useEffect, useRef } from 'react';

export const useClickOutside = <T extends HTMLElement>(
  callback: (event: MouseEvent) => void,
): RefCallback<T | null> => {
  const cleanupRef = useRef<(() => void) | null>();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((node: T | null) => {
    cleanupRef.current?.();

    if (!node) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!node.contains(event.target as Node)) {
        callbackRef.current(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    cleanupRef.current = () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
};
