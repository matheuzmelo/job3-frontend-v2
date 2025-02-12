import { IconButton, Typography } from "@mui/material";
import React from 'react';
import { TBotaoGenerico } from '../../types/TBotaoGenerico.type';


export const BotaoGenerico: React.FC<TBotaoGenerico> = ({ icon, handle, label, variant = 'white' }) => {

    const iconColor = variant === 'black' ? '#000' : '#fff';

    return (
        <IconButton
            onClick={handle}
            size="large"
            edge="end"
            aria-label="login"
            sx={{
                color: '#fff',
                '&:hover': {
                    color: '#e9e9e9',
                    transition: 'color 0.3s ease-in-out',
                },
                '> svg': {
                    color: iconColor
                }
            }}
        >
            {label && (
                <Typography sx={{
                    marginRight: '.5rem',
                    fontSize: '1.2rem',
                }}>
                    {label}
                </Typography>
            )}
            {icon}
        </IconButton >
    )
}