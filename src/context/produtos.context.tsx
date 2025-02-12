import React, { createContext, useContext, useState } from 'react';

interface Produto {
    id: number;
    codigo: string;
    descricao: string;
    unidade: string;
    valorUnidade: number;
    valorAtacado: number;
    valorRevenda: number;
    valorTabela4: number;
    subclasse: string;
}

interface ProdutoContextData {
    produtoAtual: Produto | null;
    setProdutoAtual: (produto: Produto | null) => void;
    abaAtual: number;
    setAbaAtual: (aba: number) => void;
}

const ProdutoContext = createContext<ProdutoContextData | undefined>(undefined);

export const ProdutoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [produtoAtual, setProdutoAtual] = useState<Produto | null>(null);
    const [abaAtual, setAbaAtual] = useState(1);

    return (
        <ProdutoContext.Provider value={{ produtoAtual, setProdutoAtual, abaAtual, setAbaAtual }}>
            {children}
        </ProdutoContext.Provider>
    );
};

export const useProdutoContext = () => {
    const context = useContext(ProdutoContext);
    if (!context) throw new Error('useProdutoContext must be used within a ProdutoProvider');
    return context;
};
