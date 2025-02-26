import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import logo from "../../assets/img/Job3_logo_black.svg";

export const Footer = () => {
  const [year, setYear] = useState<number>();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "5rem",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        flexGrow: 1,
        width: "100% !important",
        padding: "1rem 1.5rem",
        background: (theme) => theme.palette.primary.main,
      }}
      component="footer"
    >
      <Box>
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#fff",
          }}
        >
          Copyright © {year} JOB3.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          ">img": {
            width: {
              xs: "50px",
              lg: "60px",
            },
            height: "auto",
          },
        }}
      >
        <img src={logo} alt="Logo JOB3" />
      </Box>
    </Box>
  );
};
