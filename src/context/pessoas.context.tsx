import { createContext, useContext, useState } from 'react';

export interface Pessoa {
  id: number;
  firstName: string;
  lastName: string;
  cpfCnpj: string;
  rgInscricao: string;
  email: string;
  phone: string;
  zip: string;
  address: string;
  neighborhood: string;
  city: string;
  uf: string;
}

interface PessoaContextProps {
  pessoaAtual: Pessoa | null;
  setPessoaAtual: (pessoa: Pessoa | null) => void;
  abaAtual: number;
  setAbaAtual: (value: number) => void;
}

const PessoaContext = createContext<PessoaContextProps | undefined>(undefined);

export const PessoaProvider = ({ children }: any) => {
  const [pessoaAtual, setPessoaAtual] = useState<Pessoa | null>(null);
  const [abaAtual, setAbaAtual] = useState<number>(0);

  return (
    <PessoaContext.Provider value={{ pessoaAtual, setPessoaAtual, abaAtual, setAbaAtual }}>
      {children}
    </PessoaContext.Provider>
  );
};

export const usePessoaContext = (): PessoaContextProps => {
  const context = useContext(PessoaContext);
  if (!context) {
    throw new Error('usePessoaContext deve ser usado dentro de um PessoaProvider');
  }
  return context;
};