import React from 'react';
import { useBoolean } from '../../components/hooks';

const validations = { width: 1200 };
export default function useWindowSize(options = validations) {
  const [isValidSize, setValidSize, setNotValidSize] = useBoolean(true);

  React.useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Pass Options to set initial width
      // console.log(window.innerWidth, options.width, window.innerWidth < options.width.window);
      if (window.screen.width < options.width) {
        setNotValidSize();
      } else setValidSize();
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return isValidSize;
}
