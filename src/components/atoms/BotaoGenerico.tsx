import { IconButton, Typography } from "@mui/material";
import React from "react";
import { TBotaoGenerico } from "../../types/TBotaoGenerico.type";

export const BotaoGenerico: React.FC<TBotaoGenerico> = ({
  icon,
  handle,
  label,
  variant = "white",
  component = "button",
}) => {
  const iconColor = variant === "black" ? "#000" : "#fff";

  // Define o componente base (button, div, span, etc.)
  const Component = component === "button" ? IconButton : "div";

  return (
    <Component
      onClick={handle}
      size="large"
      edge="end"
      aria-label="login"
      sx={{
        color: "#fff",
        "&:hover": {
          color: "#e9e9e9",
          transition: "color 0.3s ease-in-out",
        },
        "> svg": {
          color: iconColor,
        },
        display: "flex", // Para alinhar ícone e texto
        alignItems: "center", // Para alinhar ícone e texto
        cursor: "pointer", // Para manter o cursor de clique
      }}
    >
      {label && (
        <Typography
          sx={{
            marginRight: ".5rem",
            fontSize: "1.2rem",
          }}
        >
          {label}
        </Typography>
      )}
      {icon}
    </Component>
  );
};
