import React, { createContext, useContext, useEffect, useState } from "react";
import { UsuariosService } from "../services/api/Usuarios/usuarios.service";
import { EmpresasService } from "../services/api/Empresas/Empresas.service";
import { isSuperAdmin } from "../Utils";

interface User {
  id?: number;
  nome: string;
  usuario: string;
  tenant_id: string;
  email: string;
  senha: string;
  nivel: number;
  created_at?: string;
}

interface UserContextData {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  getEmpresas: () => any;
  isLoading: boolean;
  getUser: () => any;
}

const UserContext = createContext<UserContextData | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllUsers = async () => {
    const token = localStorage.getItem('token') || ``;
    const adm = isSuperAdmin(token)
    console.log(adm)
    if(!adm) return

    setIsLoading(true);
    try {
      const { data } = await UsuariosService.getAll();
      const dataSorted = data.sort((itemA, itemB) => {
        if (itemA.created_at && itemB.created_at) {
          if (itemA.created_at > itemB.created_at) return -1;
          if (itemA.created_at < itemB.created_at) return 1;
        }
        return 0;
      });
      setUsers(dataSorted);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const addUser = async (user: User) => {
    setIsLoading(true);
    try {
      await UsuariosService.create(user);
      await getAllUsers(); // Atualiza a lista de usuários após adicionar um novo
    } catch (error) {
      console.error("Failed to add user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const user = await UsuariosService.getUser();
      return user;
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const getEmpresas = async () => {
    try {
      const empresas = await EmpresasService.getAll();
      return empresas.data;
    } catch (error) {
      console.error("Failed to fetch empresas:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        addUser,
        getEmpresas,
        isLoading,
        getUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUserContext must be used within a UserProvider");
  return context;
};
