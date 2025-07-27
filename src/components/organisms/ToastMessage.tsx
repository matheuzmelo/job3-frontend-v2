import { Alert, AlertColor, Snackbar } from '@mui/material';
import React from 'react';
import { TToastMessageProps } from '../../types/TToastMessage.type';

const ToastMessage: React.FC<TToastMessageProps> = ({ status, message, open, onClose }) => {
    const getAlertSeverity = (): AlertColor => {
        switch (status) {
            case 'success':
                return 'success';
            case 'alert':
                return 'warning';
            case 'warn':
            default:
                return 'error';
        }
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={onClose} severity={getAlertSeverity()} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};

export default ToastMessage;
