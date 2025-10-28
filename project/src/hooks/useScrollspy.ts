import { useEffect } from 'react';

interface UseScrollspyProps {
  sectionIds: string[];
  onActiveChange: (activeId: string) => void;
  threshold?: number;
}

export const useScrollspy = ({ sectionIds, onActiveChange, threshold = 0.2 }: UseScrollspyProps) => {
  useEffect(() => {
    const observers = new Map();
    
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onActiveChange(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin: '-20% 0px -80% 0px',
    });

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        observers.set(id, observer);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [sectionIds, onActiveChange, threshold]);
};