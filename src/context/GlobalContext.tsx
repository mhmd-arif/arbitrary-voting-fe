// context/GlobalContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

export type User = {
  inisial: string;
  jenis_kelamin: string;
  usia: number;
  partai_daerah: string;
  partai_nasional: string;
};

export type ActiveCategory = {
  id: number;
  nama: string;
};

interface GlobalContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  updateUser: (key: keyof User, value: string | number) => void;
  activeCategory: ActiveCategory;
  setActiveCategory: React.Dispatch<React.SetStateAction<ActiveCategory>>;
  updateActiveCategory: (
    key: keyof ActiveCategory,
    value: string | number
  ) => void;
}

const defaultUser: User = {
  inisial: "",
  jenis_kelamin: "",
  usia: 0,
  partai_daerah: "",
  partai_nasional: "",
};

const defaultActiveCategory: ActiveCategory = {
  id: 0,
  nama: "",
};

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>(
    defaultActiveCategory
  );

  const updateUser = (key: keyof User, value: string | number) => {
    setUser((prevUser) => ({ ...prevUser, [key]: value }));
  };

  const updateActiveCategory = (
    key: keyof ActiveCategory,
    value: string | number
  ) => {
    setActiveCategory((prevActiveCategory) => ({
      ...prevActiveCategory,
      [key]: value,
    }));
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        activeCategory,
        setActiveCategory,
        updateActiveCategory,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextProps => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
