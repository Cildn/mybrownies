import { create } from "zustand";

interface ConfigState {
  maintenanceMode: boolean;
  liveMode: boolean;
  setMaintenanceMode: (mode: boolean) => void;
  setLiveMode: (mode: boolean) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  maintenanceMode: false,
  liveMode: true,
  setMaintenanceMode: (mode) => set({ maintenanceMode: mode }),
  setLiveMode: (mode) => set({ liveMode: mode }),
}));
