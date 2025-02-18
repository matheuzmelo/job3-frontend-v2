import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';

import { NfeProvider, useNfeContext } from '../../../context/nfe.context';
import { Form } from './Form';
import { List } from './List';

// Componente para renderizar o conteúdo das abas
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

// Função para gerar propriedades de acessibilidade das abas
function handleNavigateTab(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

// Componente principal das abas
function NfeTabs() {
    const { abaAtual, setAbaAtual } = useNfeContext();

    // Função para mudar a aba atual
    const handleChange = (_event: React.SyntheticEvent, newValue: number): void => {
        setAbaAtual(newValue);
    };

    // Configuração das abas
    const ContentTabs = [
        {
            id: 0,
            label: 'Cadastro',
        },
        {
            id: 1,
            label: 'Notas Fiscais',
        },
    ];

    return (
        <Box sx={{ width: '100%', minHeight: '100dvh' }}>
            {/* Barra de abas */}
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Tabs value={abaAtual} onChange={handleChange}>
                    {ContentTabs.map((tab) => (
                        <Tab
                            sx={{
                                mr: 1,
                                minWidth: 150,
                                textTransform: 'capitalize',
                            }}
                            key={tab.id}
                            label={tab.label}
                            {...handleNavigateTab(tab.id)}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Conteúdo das abas */}
            <CustomTabPanel value={abaAtual} index={0}>
                <Form />
            </CustomTabPanel>
            <CustomTabPanel value={abaAtual} index={1}>
                <List />
            </CustomTabPanel>
        </Box>
    );
}

// Componente principal que envolve o NfeTabs com o NfeProvider
export default function Nfe() {
    return (
        <NfeProvider>
            <NfeTabs />
        </NfeProvider>
    );
}