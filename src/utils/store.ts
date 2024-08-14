import { create } from "zustand";
import { Painting } from "../pages/ExhibitionDetails";

interface UserStoreType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userId: number | null;
  setUserId: (value: number) => void;
  username: string | null;
  setUsername: (value: string) => void;
}

export const useUserStore = create<UserStoreType>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  userId: null,
  setUserId: (userId: number) => set({ userId }),
  username: null,
  setUsername: (username: string) => set({ username }),
}));

interface ExhibitionStoreType {
  id: number;
  name: string;
  artist: string;
  createdAt: string;
  paintings: Painting[];
  setId: (id: number) => void;
  setName: (name: string) => void;
  setArtist: (artist: string) => void;
  setCreatedAt: (createdAt: string) => void;
  setPaintings: (paintings: Painting[]) => void;
}

export const useExhibitionStore = create<ExhibitionStoreType>((set) => ({
  id: 0,
  name: "",
  artist: "",
  createdAt: "",
  paintings: [],
  setId: (id: number) => set({ id }),
  setName: (name: string) => set({ name }),
  setArtist: (artist: string) => set({ artist }),
  setCreatedAt: (createdAt: string) => set({ createdAt }),
  setPaintings: (paintings: Painting[]) => set({ paintings }),
}));
