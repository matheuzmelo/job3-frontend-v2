import { Backdrop, CircularProgress, Typography } from "@mui/material";

export default () => {
  return (
    <Backdrop
      open={true}
      sx={{
        color: "#ff0000",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress color="inherit" />
      <Typography variant="h6">Carregando...</Typography>
    </Backdrop>
  );
};