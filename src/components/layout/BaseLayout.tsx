import { Box } from "@mui/material";
import useAuthGuard from "../../hooks/useAuthGuard";
import { Header } from "../templates/Header";
import { Footer } from "../templates/Footer";

export const BaseLayout = ({ children }) => {
  useAuthGuard();
  return (
    <>
      <Header />
      <Box component={"main"} display="flex" flexDirection={"column"} gap={1}>
        {children}
      </Box>
      <Footer />
    </>
  );
};
