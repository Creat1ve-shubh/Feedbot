import { create } from "zustand";

interface BrandState {
  brand: string;
  isLoading: boolean;
  setBrand: (b: string) => void;
  setLoading: (v: boolean) => void;
}

export const useBrandStore = create<BrandState>((set) => ({
  brand: "",
  isLoading: false,
  setBrand: (b) => set({ brand: b }),
  setLoading: (v) => set({ isLoading: v }),
}));
