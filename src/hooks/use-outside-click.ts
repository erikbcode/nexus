import { RefObject, useEffect } from 'react';

function useOutsideClick(ref: RefObject<HTMLElement>, callback: () => void) {
  const handleClick = (e: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    // Attach the listeners to both mousedown and touchstart events
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      // Clean up the listeners
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, []);
}

export default useOutsideClick;
