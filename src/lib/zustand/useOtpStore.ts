// stores/useOtpStore.ts
import { create } from 'zustand';

interface OtpStore {
  code: string | null;
  setCode: (code: string) => void;
  clearCode: () => void;
}

export const useOtpStore = create<OtpStore>((set) => ({
  code: null,
  setCode: (code) => set({ code }),
  clearCode: () => set({ code: null }),
}));
