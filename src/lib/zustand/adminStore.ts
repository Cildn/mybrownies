import { create } from 'zustand';

type AdminState = {
  admin: { id: string; email: string; token: string } | null;
  setAdmin: (admin: AdminState['admin']) => void;
  logout: () => void;
};

export const useAdminStore = create<AdminState>((set) => ({
  admin: null,
  setAdmin: (admin) => set({ admin }),
  logout: () => set({ admin: null }),
}));
