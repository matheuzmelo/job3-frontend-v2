import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeJWT } from "../../Utils";
import { MenuList } from "../molecules/MenuList";

export const Menu: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<string[]>([]); // Tipagem explícita para as permissões
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = decodeJWT(token);
      if (decodedToken && decodedToken.modulos) {
        setPermissions(decodedToken.modulos);
      }
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Box>
      <IconButton
        sx={{
          color: "#fff",
          background: "transparent",
          "&:hover": {
            background: "transparent",
          },
        }}
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        aria-label="Abrir menu"
      >
        <MenuIcon />
      </IconButton>

      <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box
          role="presentation"
          sx={{ width: 250 }}
        >
          <Box
            sx={{
              borderBottom: "1px solid #e9e9e9",
              padding: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ textAlign: "left" }}>
                Módulos
              </Typography>
              <IconButton
                sx={{ color: 'black' }}
                aria-label="Fechar menu"
                onClick={() => setIsDrawerOpen(false)}
              >
                <KeyboardArrowLeftRounded />
              </IconButton>
            </Box>
            <Typography sx={{ textAlign: "left", marginTop: "10px" }}>
              Job3
            </Typography>
          </Box>

          <MenuList permissions={permissions} />
        </Box>
      </Drawer>
    </Box>
  );
};
