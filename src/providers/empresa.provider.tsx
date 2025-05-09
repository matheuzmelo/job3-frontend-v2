import React, { useEffect } from "react";
import { EmpresasContext } from "../contexts/empresas.context";
import { EmpresasService } from "../services/api/Empresas/Empresas.service";
import { UsuariosService } from "../services/api/Usuarios/usuarios.service";
import { DadosCep } from "../types/TCep.type";
import { isSuperAdmin, getDataCep } from "../Utils";
import { TEmpresa } from "../types/TEmpresa";

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
    const token = localStorage.getItem("token") || ``;
    const adm = isSuperAdmin(token);

    if (adm) return;

    try {
      setIsLoading(true);
      
      // const {data} = await EmpresasService.getAll();

      // setIsLoading(false);
      // if (response) {
      //   setCurrentEmpresa(response.data);
      // }
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    getEmpresas();
    getUsers();
  }, []);

  const addEmpresa = async (empresa: TEmpresa) => {
    try {
      setIsLoading(true);
      const response: any = await EmpresasService.create(empresa);

      if (response.success) {
        setEmpresas((prevEmpresas) => [...prevEmpresas, response.data]);
        setIsLoading(false);
        return response.data;
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error);
      throw error;
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
        setEmpresas,
        addEmpresa,
        getEmpresas,
        isLoading,
        consultaCep,
        currentEmpresa,
        setCurrentEmpresa,
        setError,
        error,
        users,
      }}
    >
      {children}
    </EmpresasContext.Provider>
  );
};

