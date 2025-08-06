import { Box } from "@mui/material";
import useAuthGuard from "../../hooks/useAuthGuard";
import { Footer } from "../templates/Footer";
import { Header } from "../templates/Header";

export const BaseLayout = ({ children }) => {
  useAuthGuard();
  return (
    <>
      <Header />
      <Box component={"main"} display="flex" flexDirection={"column"}>
        {children}
      </Box>
      <Footer />
    </>
  );
};
