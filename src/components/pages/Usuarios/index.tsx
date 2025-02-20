import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { UserProvider, useUserContext } from '../../../context/usuario.context';
import { UserForm } from './Form';
import { UserList } from './List';

interface TabPanelProps {
    children: React.ReactNode;
    value: number;
    index: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const UserIndex: React.FC = () => {
    const { users } = useUserContext(); // Mantém a estrutura do contexto, se necessário
    const [abaAtual, setAbaAtual] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setAbaAtual(newValue);
    };

    const ContentTabs = [
        {
            id: 0,
            label: 'Cadastrar'
        },
        {
            id: 1,
            label: 'Listar Usuários'
        }
    ];

    return (
        <Box sx={{ width: '100%', minHeight: '100vh' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                <Tabs value={abaAtual} onChange={handleChange} aria-label="tabs">
                    {ContentTabs.map(tab => (
                        <Tab
                            key={tab.id}
                            label={tab.label}
                            id={`tab-${tab.id}`}
                            aria-controls={`tabpanel-${tab.id}`}
                        />
                    ))}
                </Tabs>
            </Box>

            <CustomTabPanel value={abaAtual} index={0}>
                <UserForm />
            </CustomTabPanel>
            <CustomTabPanel value={abaAtual} index={1}>
                <UserList setAbaAtual={setAbaAtual} />
            </CustomTabPanel>
        </Box>
    );
};

export default function Usuario() {
    return (
        <UserProvider>
            <UserIndex />
        </UserProvider>
    );
}