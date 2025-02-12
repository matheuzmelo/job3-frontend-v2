import { Box, Container, Typography, useTheme } from '@mui/material';
import React from 'react';
import Logo from '../../../assets/img/Job3_logo_black.svg';

const NotFound: React.FC = () => {
    const theme = useTheme()
    return (
        <Container sx={{
            minWidth: "100vw",
            background: theme.palette.primary.main,
            display: 'grid',
            placeItems: "center",
            minHeight: "100dvh",
        }}>
            <Box sx={{
                display: 'grid',
                placeItems: { xs: 'center', md: 'unset' }
            }}>
                <Box sx={{
                    backgroundImage: `url(${Logo})`,
                    width: '160px',
                    height: "160px",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain"
                }}></Box>
                <Typography variant="h1" component="h2" color="white" sx={{ fontWeight: 900 }}>
                    404
                </Typography>
                <Typography variant="h5" color='white'>
                    Página não encontrada
                </Typography>
                <Typography variant="body1" style={{ marginBottom: '20px', maxWidth: "70%" }} color='white'>
                    A página que você está procurando pode ter sido removida,
                    teve seu nome alterado ou está temporariamente indisponível.
                </Typography>
            </Box>
        </Container>
    );
};

export default NotFound;
