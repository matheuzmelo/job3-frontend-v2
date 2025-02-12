import { CssBaseline, ThemeProvider } from "@mui/material"
import { Suspense } from "react"
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom"
import BaseLayout from "./components/layout/BaseLayout"
import Loading from "./components/pages/Loading"
import Login from "./components/pages/Login"
import { menuLayout } from "./routes/menu"
import { theme } from "./theme/theme"
import { MenuLayout } from "./types/TMenu.type"

export default () => {
    const createRoutes = (menu: MenuLayout) => {
        return menu.map(item => (
            <Route
                path={item.route}
                element={
                    <Suspense fallback={<Loading />}>
                        {item.page}
                    </Suspense>
                }
                key={item.route}
            />
        ))
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <HashRouter>
                <Routes>
                    {/* Rota de login separada do BaseLayout */}
                    <Route path="/login" element={<Login />} />

                    {/* Rotas que utilizam o BaseLayout */}
                    <Route
                        path="/*"
                        element={
                            <BaseLayout>
                                <Routes>{createRoutes(menuLayout)}</Routes>
                            </BaseLayout>
                        }
                    />
                </Routes>
            </HashRouter>
        </ThemeProvider>
    )
}
