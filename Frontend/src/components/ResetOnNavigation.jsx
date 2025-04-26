import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ResetOnNavigation = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); 
    console.log("Navigation detected! Location changed to:", location.pathname);
  }, [location]);

  // This component doesn't render anything
  return null; 
};

export default ResetOnNavigation;
