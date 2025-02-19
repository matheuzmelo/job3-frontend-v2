import React, { createContext, useContext, useState } from 'react';

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
    addUser: (user: User) => void; // Função para adicionar usuário
}

const UserContext = createContext<UserContextData | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    const addUser = (user: User) => {
        setUsers([...users, user]);
    };

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, users, setUsers, addUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUserContext must be used within a UserProvider');
    return context;
};
