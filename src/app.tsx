import { CssBaseline, ThemeProvider } from "@mui/material";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import BaseLayout from "./components/layout/BaseLayout";
import Loading from "./components/pages/Loading";
import Login from "./components/pages/Login";
import { menuLayout } from "./routes/menu";
import { theme } from "./theme/theme";
import { MenuLayout } from "./types/TMenu.type";

const App = () => {
  const createRoutes = (menu: MenuLayout) => {
    return menu.map((item) => (
      <Route
        path={item.route}
        element={<Suspense fallback={<Loading />}>{item.page}</Suspense>}
        key={item.route}
      />
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Rota de login separada do BaseLayout */}
          <Route path="/login" element={<Login />} />

          {/* Rotas que utilizam o BaseLayout */}
        </Routes>
        <BaseLayout>
          <Routes>{createRoutes(menuLayout)}</Routes>
        </BaseLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
