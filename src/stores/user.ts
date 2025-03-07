import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserStore = {
  id: string | null;
  setId: (id: string) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      id: null,
      setId: (id: string) => set({ id }),
    }),
    { name: 'scrumPokerUser' },
  ),
);
