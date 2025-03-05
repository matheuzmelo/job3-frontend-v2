import { createContext, useContext, useState } from 'react';

export interface Cliente {
    id: number;
    name: string;
    fantasia: string;
    address: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
    email: string;
    ieRg: string;
    cpfCnpj: string;
    phone: string;
    types: string[];
}

interface ClienteContextProps {
    clienteAtual: Cliente | null;
    setClienteAtual: (cliente: Cliente | null) => void;
    abaAtual: number;
    setAbaAtual: (value: number) => void;
}

const ClienteContext = createContext<ClienteContextProps | undefined>(undefined);

export const ClienteProvider = ({ children }: any) => {
    const [clienteAtual, setClienteAtual] = useState<Cliente | null>(null);
    const [abaAtual, setAbaAtual] = useState<number>(0);

    return (
        <ClienteContext.Provider value={{ clienteAtual, setClienteAtual, abaAtual, setAbaAtual }}>
            {children}
        </ClienteContext.Provider>
    );
};

export const useClienteContext = (): ClienteContextProps => {
    const context = useContext(ClienteContext);
    if (!context) {
        throw new Error('useClienteContext deve ser usado dentro de um ClienteProvider');
    }
    return context;
};
