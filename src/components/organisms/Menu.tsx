import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
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

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

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
        onClick={toggleDrawer}
        aria-label="Abrir menu"
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer (menu lateral) */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <Box
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={toggleDrawer}
          sx={{ width: 250 }} // Define uma largura fixa para o Drawer
        >
          {/* Cabeçalho do Drawer */}
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
                onClick={toggleDrawer}
                sx={{ color: 'black' }}
                aria-label="Fechar menu"
              >
                <KeyboardArrowRightRoundedIcon />
              </IconButton>
            </Box>
            <Typography sx={{ textAlign: "left", marginTop: "10px" }}>
              Job3
            </Typography>
          </Box>

          {/* Lista de menus com base nas permissões */}
          <MenuList permissions={permissions} />
        </Box>
      </Drawer>
    </Box>
  );
};
