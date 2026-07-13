import { create } from "zustand";
import { persist } from "zustand/middleware";

interface bioType {
  biometrico: any;
  setBiometrico: (biometrico: any) => void;
  loadBiometrico: boolean,
  setLoadBiometrico: (valor: boolean) => void;
}

export const useBiometricoStore = create<bioType>()(
  persist(
    (set) => ({
      biometrico: null,
      loadBiometrico: false,
      setBiometrico: (biometrico: any) => set({biometrico}),
      setLoadBiometrico: (valor: boolean) => set({loadBiometrico: valor})
    }), {
      name: "store-biometrico",
    }
  )
);