import { Backdrop, CircularProgress, Typography } from "@mui/material";

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  return (
    <Backdrop
      open={true}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backdropFilter: 1,
      }}
    >
      <CircularProgress color="primary" />
      <Typography variant="h6">Carregando...</Typography>
    </Backdrop>
  );
};