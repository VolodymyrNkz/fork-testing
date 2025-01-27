'use client';
import React, { ReactNode, useRef } from 'react';
import { styles } from '@/app/_components/Slider/styles';

interface SliderProps {
  children: ReactNode;
  cardWidth: string;
}

export const Slider: React.FC<SliderProps> = ({ children, cardWidth }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    sliderRef.current?.classList.add('cursor-grabbing');
    sliderRef.current?.classList.remove('cursor-grab');
    startX.current = e.pageX - sliderRef.current!.offsetLeft;
    scrollLeft.current = sliderRef.current!.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const slider = sliderRef.current!;
    const x = e.pageX - slider.offsetLeft;
    const walk = x - startX.current;
    slider.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUpOrLeave = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    sliderRef.current?.classList.remove('cursor-grabbing');
    sliderRef.current?.classList.add('cursor-grab');
  };

  return (
    <div className={styles.sliderContainer}>
      <div
        ref={sliderRef}
        className={`${styles.slider} cursor-grab`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
      >
        {React.Children.map(children, (child, index) => (
          <div key={index} style={{ width: cardWidth }} className={styles.card}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
