import { useEffect, useState } from "react"

const useViewPort = () => {
  // set the initial width to be desktop/greater than mobile
  const [width, setWidth] = useState(601);
  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    // Call handler right away so state gets updated with initial window size
    handleWindowResize();
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return { width };
};
export default useViewPort;
