import React, { createContext, useContext, useEffect, useState } from 'react';
import { UsuariosService } from '../services/api/Usuarios/usuarios.service';
import { EmpresasService } from '../services/api/Empresas/Empresas.service';

interface User {
    id: number;
    nome: string;
    usuario: string;
    tenant_id: string;
    email: string;
    senha: string;
    nivel: number;
}

interface UserContextData {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    users: User[];
    setUsers: (users: User[]) => void;
    addUser: (user: User) => void;
    getEmpresas: () => any;
}

const UserContext = createContext<UserContextData | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    const getAllUsers = async () => {
        const users = await UsuariosService.getAll();
        if (users) {
            setUsers(users.data);
        }
    }
    useEffect(()=> {
        getAllUsers()
    }, [])

    const addUser = async (user: User) => {
        await UsuariosService.create(user);
        setUsers([...users, user]);
    };

    const getEmpresas = async () => {
        const empresas = await EmpresasService.getAll();
        
        if (empresas) {
            return empresas.data;
        }
    }

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, users, setUsers, addUser, getEmpresas }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUserContext must be used within a UserProvider');
    return context;
};
