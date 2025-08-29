import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SettingsStore = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'cyberpunk',
      setTheme: (theme: string) => set({ theme }),
    }),
    { name: 'scrum-poker-settings' },
  ),
);
