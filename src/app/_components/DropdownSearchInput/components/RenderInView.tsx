import { useIntersect } from '@/app/_hooks/useIntersect';
import { FC, PropsWithChildren, useRef, useState } from 'react';

interface Props {
  initialVisible?: boolean;
  defaultHeight?: number;
  visibleOffset?: number;
  stayRendered?: boolean;
  root?: HTMLElement | 'body' | 'document';
}

export const RenderIfVisible: FC<PropsWithChildren<Props>> = ({
  initialVisible = false,
  defaultHeight = 300,
  visibleOffset = 1000,
  stayRendered = false,
  root = 'body',
  children,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(initialVisible);
  const placeholderHeight = useRef<number>(defaultHeight);
  const wasVisible = useRef(false);

  const toggleRow = (node: IntersectionObserverEntry) => {
    if (wasVisible.current && stayRendered) return;

    if (node.isIntersecting) {
      wasVisible.current = true;
      setIsVisible(true);
    } else if (!stayRendered) {
      setIsVisible(false);
    }
  };

  const ref = useIntersect<HTMLDivElement>(
    (entries) => {
      if (stayRendered && isVisible) return;

      const node = entries[0];

      if (node.isIntersecting) {
        placeholderHeight.current = node.target.clientHeight;
      }
      if (typeof window !== undefined && window.requestIdleCallback) {
        window.requestIdleCallback(() => toggleRow(node), {
          timeout: 600,
        });
      } else {
        toggleRow(node);
      }
    },
    () => {},
    { root, rootMargin: `${visibleOffset}px 0px ${visibleOffset}px 0px`, threshold: 1.0 },
  );

  return <div ref={ref}>{isVisible && children}</div>;
};
