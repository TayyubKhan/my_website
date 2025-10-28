import { useEffect } from 'react';

interface UseScrollspyProps {
  sectionIds: string[];
  onActiveChange: (activeId: string) => void;
  threshold?: number;
  rootMargin?: string;
}

export const useScrollspy = ({
  sectionIds,
  onActiveChange,
  threshold = 0.3,
  rootMargin = '0px 0px -60% 0px',
}: UseScrollspyProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section with the highest intersection ratio
        const visibleEntry = entries.reduce((prev, curr) => {
          return curr.intersectionRatio > prev.intersectionRatio ? curr : prev;
        }, entries[0]);

        if (visibleEntry?.isIntersecting) {
          onActiveChange(visibleEntry.target.id);
        }
      },
      {
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0], // Multiple thresholds for smoother detection
        rootMargin,
      }
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, onActiveChange, threshold, rootMargin]);
};