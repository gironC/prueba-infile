import React, { useRef } from "react";
import { Link, Route } from "react-router-dom";
import { IonContent, IonPage, IonButton, useIonRouter, useIonToast } from "@ionic/react";
import { logOut, fingerPrint } from "ionicons/icons";
import { motion, AnimatePresence } from 'motion/react'
import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";
import "./Perfil.css";

import { useBiometricoStore } from "../store/biometrico";
import { useUsuarioStore } from "../store/usuario";

import ButtonComponent from "../components/Button";

const Perfil: React.FC = () => {
  const [present] = useIonToast();
  const router = useIonRouter();
  const { biometrico, setBiometrico } = useBiometricoStore();
  const { usuario, setUsuario } = useUsuarioStore();
  const activar = async () => {
    try {
      const res = await BiometricAuth.checkBiometry();
      if (!res.isAvailable) {
        present({message: 'Tu dispositivo no tiene biometría activa.', duration: 2000, position: 'top'});
        return;
      }
      await BiometricAuth.authenticate({
        androidTitle: 'Iniciar sesion',
        reason: 'Autenticate para ingresar',
        cancelTitle: 'Cancelar',
        allowDeviceCredential: true
      });
      setBiometrico(usuario.id);
      console.log('Biometrico puesto papu');
    } catch (err) {
      console.log(err);
      present({message: 'No se pudo activar el login biométrico.', duration: 2000, position: 'top'});
    }
  }

  const cerrarSesion = () => {
    setUsuario(null);
    router.push('/login', 'root', 'replace');
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <AnimatePresence mode="wait">
          <motion.div key="div" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y:-20}} transition={{duration: 0.2}} className="w-full min-h-full flex flex-col items-center p-4">
            <div className="w-full">
              <h2 className="!mt-16">{usuario?.nombres} {usuario?.apellidos}</h2>
              <h4 className="!mb-8">Bienvenido</h4>
            </div>
            <ButtonComponent onClick={activar} icono={fingerPrint} tipo="primary" text="Activar login biometrico" />
            <ButtonComponent onClick={cerrarSesion} icono={logOut} tipo="error" text="Cerrar sesion" />
          </motion.div>
        </AnimatePresence>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
