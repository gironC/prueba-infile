import { create } from "zustand";
import { persist } from "zustand/middleware";

interface usuarioType {
  usuario: any;
  setUsuario: (usuario: any) => void;
  loadUsuario: boolean,
  setLoadUsuario: (valor: boolean) => void;
}

export const useUsuarioStore = create<usuarioType>()(
  persist(
    (set) => ({
      usuario: null,
      loadUsuario: false,
      setUsuario: (usuario: any) => set({usuario}),
      setLoadUsuario: (valor: boolean) => set({loadUsuario: valor})
    }), {
      name: "store-usuario",
    }
  )
);