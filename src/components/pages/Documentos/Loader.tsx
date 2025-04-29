import { Skeleton } from "@mui/material";
import { Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export const FormSkeleton: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box display="grid" gap={4}>
        {/* Header */}
        <Skeleton variant="text" width="30%" height={60} />
        
        {/* First row of inputs */}
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={56} />
          </Box>
          <Box display="grid" gridTemplateColumns="1fr" justifyContent="flex-end">
            <Skeleton variant="rectangular" height={56} />
          </Box>
        </Box>
        
        {/* Single input row */}
        <Skeleton variant="rectangular" height={56} />
        
        {/* Client selection row */}
        <Box display="grid" gridTemplateColumns="1fr 200px" gap={2}>
          <Box>
            <Skeleton variant="text" width="20%" height={30} />
            <Skeleton variant="rectangular" height={56} />
          </Box>
          <Skeleton variant="rectangular" height={56} sx={{ mt: 2 }} />
        </Box>
        
        {/* Operation nature row */}
        <Box display="flex" gap={2}>
          <Skeleton variant="rectangular" width="100%" height={56} />
          <Box display="flex" alignItems="center" gap={1}>
            <Skeleton variant="text" width="100px" height={30} />
            <Skeleton variant="rectangular" width={40} height={20} />
          </Box>
        </Box>
        
        {/* Product selection row */}
        <Box display="flex" gap={2} alignItems="center">
          <Box width="100%">
            <Skeleton variant="text" width="20%" height={30} />
            <Skeleton variant="rectangular" height={56} />
          </Box>
          <Box width="120px" mt={3}>
            <Skeleton variant="rectangular" height={56} />
          </Box>
          <Box width="120px" mt={3}>
            <Skeleton variant="rectangular" height={56} />
          </Box>
          <Box width="120px" mt={3}>
            <Skeleton variant="rectangular" height={56} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width={100} height={56} sx={{ mt: 2 }} />
          </Box>
        </Box>
        
        {/* Products table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {['Produto', 'Quantidade', 'Unidade', 'Valor Unitário', 'Subtotal', 'Total', 'Ações'].map((header) => (
                  <TableCell key={header}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3].map((row) => (
                <TableRow key={row}>
                  {Array(7).fill(0).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Observations */}
        <Skeleton variant="rectangular" height={120} />
        
        {/* Action buttons */}
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" gap={2}>
            <Skeleton variant="rectangular" width={120} height={40} />
            <Skeleton variant="rectangular" width={120} height={40} />
          </Box>
          <Skeleton variant="rectangular" width={120} height={40} />
        </Box>
      </Box>
    </Container>
  );
};