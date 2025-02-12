import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from '../components/pages/Login';
import NotFound from '../components/pages/NotFound';
import { menuLayout } from '../routes/menu';
import { TMenuItem } from '../types/TMenu.type';

export const useProtectedRoutes = (
  isAuthenticated: boolean
) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login`);
    }
  }, [isAuthenticated, navigate]);

  return (
    <Routes>
      {
        menuLayout.map((item: TMenuItem) => (
          <Route
            key={item.route}
            path={item.route}
            element={
              item.page
            }
          />
        ))
      }
      <Route path="/unauthorized" element={<NotFound />} />
      < Route path="/login" element={<Login />} />
    </Routes>
  );
};