import React, { createContext, useContext, useState } from 'react';

// Tipos para os dados da NFe e o contexto
interface Nfe {
    id?: number;
    numero: string;
    dataEmissao: string;
    destinatario: string;
    valorTotal: string;
    chaveAcesso: string;
}

interface NfeContextProps {
    nfeAtual: Nfe | null;
    setNfeAtual: React.Dispatch<React.SetStateAction<Nfe | null>>;
    abaAtual: number;
    setAbaAtual: React.Dispatch<React.SetStateAction<number>>;
}

const NfeContext = createContext<NfeContextProps | undefined>(undefined);

export const NfeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [nfeAtual, setNfeAtual] = useState<Nfe | null>(null);
    const [abaAtual, setAbaAtual] = useState<number>(0);

    return (
        <NfeContext.Provider value={{ nfeAtual, setNfeAtual, abaAtual, setAbaAtual }}>
            {children}
        </NfeContext.Provider>
    );
};

export const useNfeContext = (): NfeContextProps => {
    const context = useContext(NfeContext);
    if (!context) {
        throw new Error('useNfeContext deve ser usado dentro de um NfeProvider');
    }
    return context;
};
