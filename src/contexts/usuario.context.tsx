import { createContext } from "react";
import { TUser } from "../types/TUser.type";

interface UserContextData {
  currentUser: TUser | null;
  setCurrentUser: (user: TUser | null) => void;
  users: TUser[];
  setUsers: (users: TUser[]) => void;
  addUser: (user: TUser) => Promise<TUser>;
  getEmpresas: () => any;
  isLoading: boolean;
  getUser: () => any;
  getAllUsers: () => Promise<void>;
  businessUsers: any
  setBusinessUsers: (user: any) => void
}

export const UserContext = createContext<UserContextData | undefined>(undefined);