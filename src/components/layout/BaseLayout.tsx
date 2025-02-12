import { Box } from "@mui/material"
import Footer from "../templates/Footer"
import Header from "../templates/Header"
import useAuthGuard from "../../hooks/useAuthGuard"

export default ({ children }) => {
  useAuthGuard()
  return (
    <>
      <Header />
      <Box component={"main"} display="flex" flexDirection={'column'} gap={1}>
        {children}
      </Box>
      <Footer />
    </>
  )
}