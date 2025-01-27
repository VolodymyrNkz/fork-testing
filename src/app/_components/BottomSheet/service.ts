import { useRef } from 'react';

const useSwipeToClose = (onClose: () => void) => {
  const startYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    startYRef.current = null;
    onClose();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startYRef.current === null) return;

    const deltaY = e.touches[0].clientY - startYRef.current;

    if (deltaY > 5) {
      handleTouchEnd();
    }
  };

  return { handleTouchStart, handleTouchMove };
};

export default useSwipeToClose;
