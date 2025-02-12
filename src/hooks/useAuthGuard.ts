import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useAuthGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && location.pathname !== "/login") {
      navigate(`/login`, { replace: true });
    }
  }, [location, navigate]);
};

export default useAuthGuard;
