import React, { createContext, useContext, useState } from 'react';

// Tipos para os dados da NFe e o contexto
interface Nfe {
    numero: string;
    pessoa_id: number;
    empresa_id: number;
    produtos: {
        descricao: string;
        quantidade: number;
        valor_unitario: number;
    }[];
}

interface NfeContextProps {
    nfeAtual: Nfe | null;
    setNfeAtual: React.Dispatch<React.SetStateAction<Nfe | null>>;
    abaAtual: number;
    setAbaAtual: React.Dispatch<React.SetStateAction<number>>;
}

// Cria o contexto
const NfeContext = createContext<NfeContextProps | undefined>(undefined);

// Provedor do contexto
export const NfeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [nfeAtual, setNfeAtual] = useState<Nfe | null>(null);
    const [abaAtual, setAbaAtual] = useState<number>(0);

    return (
        <NfeContext.Provider value={{ nfeAtual, setNfeAtual, abaAtual, setAbaAtual }}>
            {children}
        </NfeContext.Provider>
    );
};

// Hook personalizado para usar o contexto
export const useNfeContext = (): NfeContextProps => {
    const context = useContext(NfeContext);
    if (!context) {
        throw new Error('useNfeContext deve ser usado dentro de um NfeProvider');
    }
    return context;
};