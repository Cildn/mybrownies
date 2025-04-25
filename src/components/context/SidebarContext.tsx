"use client";

import { createContext, useContext, useState } from "react";

interface SidebarContextType {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  isSearchOpen: boolean;
  toggleSearch: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        isMenuOpen,
        toggleMenu: () => setMenuOpen((prev) => !prev),
        isCartOpen,
        toggleCart: () => setCartOpen((prev) => !prev),
        isSearchOpen,
        toggleSearch: () => setSearchOpen((prev) => !prev),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}