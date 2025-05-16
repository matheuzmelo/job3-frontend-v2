import React, { useEffect } from "react";
import { EmpresasContext } from "../contexts/empresas.context";
import { EmpresasService } from "../services/api/Empresas/Empresas.service";
import { UsuariosService } from "../services/api/Usuarios/usuarios.service";
import { DadosCep } from "../types/TCep.type";
import { TEmpresa } from "../types/TEmpresa";
import { getDataCep } from "../Utils";

export const EmpresaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentEmpresa, setCurrentEmpresa] = React.useState<TEmpresa | null>(
    null
  );
  const [empresas, setEmpresas] = React.useState<TEmpresa[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<any>(null);
  const [users, setUsers] = React.useState<any | null>(null);
  const [isSavingLoading, setIsSavingLoading] = React.useState<boolean>(false)
  const getUsers = async () => {
    try {
      const response = await UsuariosService.getAll();

      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      setError(error);
    }
  };

  const getEmpresas = async () => {
    try{
        setIsLoading(true)
         const response = await EmpresasService.getEmpresas()
         setEmpresas(response.data)
         setIsLoading(false)
       }catch(error) {
         console.error(error);
         setIsLoading(false)
       }
  };

  useEffect(() => {
    getEmpresas();
    getUsers();
  }, []);

  const addEmpresa = async (empresa: TEmpresa) => {
    try {
      setIsSavingLoading(true);
      const response: any = await EmpresasService.create(empresa);

      if (response.success) {
        setEmpresas((prevEmpresas) => [...prevEmpresas, response.data]);
        return response.data;
      }
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setIsSavingLoading(false)
    }
  };

  const consultaCep = async (cep: string): Promise<DadosCep | undefined> => {
    try {
      const dados = await getDataCep(cep);
      return dados;
    } catch (error) {
      setError(error);
    }
  };

  return (
    <EmpresasContext.Provider
      value={{
        empresas,
        addEmpresa,
        getEmpresas,
        isLoading,
        consultaCep,
        currentEmpresa,
        setCurrentEmpresa,
        error,
        users,
        isSavingLoading,
      }}
    >
      {children}
    </EmpresasContext.Provider>
  );
};

