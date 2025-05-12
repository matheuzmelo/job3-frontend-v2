import { createContext } from "react";
import { DadosCep } from "../types/TCep.type";
import { TEmpresa } from "../types/TEmpresa";


interface EmpresaContextData {
  empresas: TEmpresa[];
  addEmpresa: (empresa: TEmpresa) => Promise<void>;
  getEmpresas: () => any;
  isLoading: boolean;
  consultaCep: (cep: string) => Promise<DadosCep | undefined>;
  currentEmpresa: TEmpresa | null;
  setCurrentEmpresa: (empresa: TEmpresa | null) => void;
  error: any;
  users: any | null;
}

export const EmpresasContext = createContext<EmpresaContextData | undefined>(
  undefined
);
