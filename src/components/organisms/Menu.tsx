import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { decodeJWT } from '../../Utils';
import { BotaoGenerico } from '../atoms/BotaoGenerico';
import { MenuList } from "../molecules/MenuList";

export default () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [permission, setPermission] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token')

        if(!token) return navigate(`/login`) 

        const data = decodeJWT(token)

        setPermission(data.modulos)
    }, [])

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <Box>
            <IconButton sx={{
                color: '#fff',
                background: "transparent",
                '&:hover': {
                    background: "transparent",
                }
            }} onClick={toggleDrawer}>
                <MenuIcon sx={{
                    background: "transparent",
                    '&:hover': {
                        background: "transparent",
                    }
                }} />
            </IconButton>

            <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
                <Box role="presentation" onClick={toggleDrawer} onKeyDown={toggleDrawer}>
                    <Box sx={{
                        borderBottom: "1px solid #e9e9e9",
                        padding: "1rem"
                    }}>

                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                            <Typography variant="h5" sx={{
                                textAlign: "left",
                            }}>
                                Módulos
                            </Typography>

                            <BotaoGenerico icon={<KeyboardArrowRightRoundedIcon />} variant='black' />
                        </Box>
                        <Typography
                            sx={{
                                textAlign: "left",
                                marginTop: "10px",
                            }}>
                            Job3
                        </Typography>
                    </Box>
                    <MenuList permissions={permission} />
                </Box>
            </Drawer>
        </Box>
    );
};
