import { AccountCircle, Lock } from '@mui/icons-material';
import { Box, Button, CircularProgress, InputAdornment, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Job3_logo_black from '../../assets/img/Job3_logo_black.svg';
import api from '../../services/api';
import ToastMessage from '../organisms/ToastMessage';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState({ open: false, status: 'success', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCloseToast = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('auth', {
                email: email,
                senha: password,
            });

            console.log(response)

            localStorage.setItem('token', response.data.data);
            navigate(`/`);
        } catch (e) {
            setToast({
                open: true,
                status: 'warn',
                message: 'Não foi possível realizar o login. Verifique suas credenciais.',
            });
        } finally {
            setLoading(false);
        }
    };

    const BackgroudSide = () => (
        <Box
            sx={{
                display: { xs: 'none', lg: 'grid' },
                height: '100dvh',
                backgroundSize: 'cover',
                backgroundColor: (theme) => theme.palette.primary.main,
                backgroundPosition: 'center',
                width: '66.66vw',
                position: 'absolute',
                top: 0,
                right: 0,
                placeItems: 'center',
            }}
        >
            <Box
                sx={{
                    backgroundImage: `url(${Job3_logo_black})`,
                    width: '300px',
                    height: '300px',
                    position: 'absolute',
                    backgroundSize: '300px',
                    backgroundRepeat: 'no-repeat',
                }}
            />
        </Box>
    );

    const theme = useTheme();

    return (
        <>
            <Box
                sx={{
                    display: 'grid',
                    placeItems: 'center',
                    height: '100dvh',
                    width: { sm: '100vw', lg: '33.34vw' },
                    padding: { sm: '1rem' },
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <Box
                    sx={{
                        display: { xs: 'block', lg: 'none' },
                        backgroundImage: `url(${Job3_logo_black})`,
                        width: '200px',
                        height: '200px',
                        backgroundSize: '100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }}
                />
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        maxWidth: 400,
                        margin: 'auto',
                        padding: 2,
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Login
                    </Typography>

                    <TextField
                        label="Login"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, width: '50%', padding: '1rem', height: '24px', color: 'white', position: 'relative' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: 'white', position: 'absolute' }} />
                        ) : (
                            'Entrar'
                        )}
                    </Button>
                    <Box>
                        <Typography sx={{ textAlign: 'center', mt: 4, fontSize: 13 }}>
                            V-APP: 2025.01.29<br />
                            ambiente: hml-service
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <BackgroudSide />
            <ToastMessage
                status={toast.status}
                open={toast.open}
                message={toast.message}
                onClose={handleCloseToast}
            />
        </>
    );
};
