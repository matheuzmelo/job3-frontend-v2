import { Box, Container, Skeleton } from "@mui/material";
import React from "react";

export const FormLoading: React.FC = () => {
  return (
    <Container>
      {Array.from({ length: 3 }).map((_, index) => (
        <Box key={index} display={'flex'} gap={2}>
          <Skeleton width="100%" height={65} />
          <Skeleton width="100%" height={65} />
        </Box>
      ))}
      <Box display={'flex'} flexDirection={"column"} gap={2}>
        <Skeleton width="100%" height={65} />
        <Skeleton width="100%" height={65} />
        <Skeleton width="100%" height={65} />
      </Box>
    </Container>
  );
};