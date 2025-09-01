import { CssBaseline, ThemeProvider } from "@mui/material";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BaseLayout } from "./components/layout/BaseLayout";
import Loading from "./components/pages/Loading";
import Login from "./components/pages/Login";
import { menuLayout } from "./routes/menu";
import { theme } from "./theme/theme";
import { MenuLayout, TMenuItem, } from "./types/TMenu.type";

export const App = () => {
  const createRoutes = (menu: MenuLayout): JSX.Element[] => {
    return menu.flatMap((item: TMenuItem) => {
      const routes: JSX.Element[] = [];

      // Se tiver route definido → cria rota
      if (item.route) {
        routes.push(
          <Route
            key={item.route}
            path={item.route}
            element={<Suspense fallback={<Loading />}>{item.page}</Suspense>}
          />
        );
      }

      // Se tiver subMenu → cria rotas recursivas
      if (item.subMenu) {
        routes.push(...createRoutes(item.subMenu));
      }

      return routes;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Rota de login fora do layout */}
          <Route path="/login" element={<Login />} />

          {/* Todas as outras dentro do layout */}
          <Route
            path="/*"
            element={
              <BaseLayout>
                <Routes>{createRoutes(menuLayout)}</Routes>
              </BaseLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
