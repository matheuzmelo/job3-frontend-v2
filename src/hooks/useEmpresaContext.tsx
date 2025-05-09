import { useContext } from "react";
import { EmpresasContext } from "../contexts/empresas.context";

export const useEmpresasContext = () => {
  const context = useContext(EmpresasContext);
  if (context === undefined)
    throw new Error(
      "useEmpresasContext must be used within a EmpresasProvider"
    );
  return context;
};