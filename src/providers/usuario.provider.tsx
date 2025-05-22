import { useEffect, useState } from "react";
import { UserContext } from "../contexts/usuario.context";
import { EmpresasService } from "../services/api/Empresas/Empresas.service";
import { UsuariosService } from "../services/api/Usuarios/usuarios.service";
import { TUser } from "../types/TUser.type";
import { isSuperAdmin } from "../Utils";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<TUser | null>(null);
  const [users, setUsers] = useState<TUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [businessUsers, setBusinessUsers] = useState([])

  const getAllUsers = async () => {
    const token = localStorage.getItem("token") || ``;
    const adm = isSuperAdmin(token);
    if (!adm) return;

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

  const addUser = async (user: TUser): Promise<TUser> => {
    setIsLoading(true);
    try {
      const createdUser = await UsuariosService.create(user);
      setUsers((prevUsers) => [...prevUsers, createdUser]);
      return createdUser;
    } catch (error) {
      console.error("Failed to add user:", error);
      throw error; // Re-throw the error to maintain the Promise<User> contract
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
      const empresas = await EmpresasService.getEmpresas();
      if(empresas){
        return empresas.data;
      }
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
        getAllUsers,
        businessUsers, 
        setBusinessUsers
      }}
    >
      {children}
    </UserContext.Provider>
  );
};