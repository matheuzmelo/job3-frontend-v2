import { createContext, useContext, useEffect, useState } from "react";
import { PessoasService } from "../services/api/Pessoas/pessoas.service";
import { DadosCep } from "../types/TCep.type";
import { getDataCep } from "../Utils";

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
  consultaCep: (cep: string) => Promise<DadosCep | undefined>;
  abaAtual: number;
  setAbaAtual: (value: number) => void;
  error;
  setError;
  pessoas: any;
  getPessoas: () => Promise<void>;
}

const PessoaContext = createContext<PessoaContextProps | undefined>(undefined);

export const PessoaProvider = ({ children }: any) => {
  const [pessoaAtual, setPessoaAtual] = useState<Pessoa | null>(null);
  const [abaAtual, setAbaAtual] = useState<number>(0);
  const [error, setError] = useState<any>();
  const [pessoas, setPessoas] = useState<any>([]);

  const consultaCep = async (cep: string): Promise<DadosCep | undefined> => {
    try {
      const dados = await getDataCep(cep);
      return dados;
    } catch (err) {
      setError(err);
    }
  };

  const getPessoas = async () => {
    try {
      const { data } = await PessoasService.getAll();
      setPessoas(data);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    getPessoas();
  }, []);

  return (
    <PessoaContext.Provider
      value={{
        pessoaAtual,
        setPessoaAtual,
        abaAtual,
        setAbaAtual,
        error,
        setError,
        consultaCep,
        pessoas,
        getPessoas,
      }}
    >
      {children}
    </PessoaContext.Provider>
  );
};

export const usePessoaContext = (): PessoaContextProps => {
  const context = useContext(PessoaContext);
  if (!context) {
    throw new Error(
      "usePessoaContext deve ser usado dentro de um PessoaProvider"
    );
  }
  return context;
};
