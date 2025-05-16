import { CssBaseline, ThemeProvider } from "@mui/material";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BaseLayout } from "./components/layout/BaseLayout";
import Loading from "./components/pages/Loading";
import Login from "./components/pages/Login";
import { menuLayout } from "./routes/menu";
import { theme } from "./theme/theme";
import { MenuLayout } from "./types/TMenu.type";

export const App = () => {
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
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />

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
