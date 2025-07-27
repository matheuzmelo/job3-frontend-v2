import { Box, Skeleton } from "@mui/material";
import React from "react";

export const ListLoading: React.FC = () => {
  return (
    <Box>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} width="100%" height={65} />
      ))}
    </Box>
  );
};