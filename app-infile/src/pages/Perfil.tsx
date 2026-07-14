import React, { useEffect, useRef, useState } from "react";
import { Link, Route } from "react-router-dom";
import { IonContent, IonPage, IonButton, useIonRouter, useIonToast } from "@ionic/react";
import { logOut, fingerPrint } from "ionicons/icons";
import { motion, AnimatePresence, useScroll } from 'motion/react'
import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";
import "./Perfil.css";

import { useBiometricoStore } from "../store/biometrico";
import { useUsuarioStore } from "../store/usuario";

import ButtonComponent from "../components/Button";

const Perfil: React.FC = () => {
  const [present] = useIonToast();
  const router = useIonRouter();
  const { biometrico, setBiometrico, loadBiometrico, setLoadBiometrico } = useBiometricoStore();
  const { usuario, setUsuario, loadUsuario, setLoadUsuario } = useUsuarioStore();

  const [estadoB, setEstadoB] = useState(0); // 0 no se muestra, 1 activar, 2 desactivar, 3 reemplazar

  useEffect(() => {
    setLoadBiometrico(true);
    setLoadUsuario(true);
  }, []);

  useEffect(() => {
    if (loadBiometrico && loadUsuario) {
      validarBio(biometrico);
    }
  }, [loadBiometrico, loadUsuario]);

  async function validarBio(bio?: any) {
    try {
      const res = await BiometricAuth.checkBiometry();
      if (!res.isAvailable) {
        return;
      }
      if (!bio) {
        setEstadoB(1);
      }
      if (bio == usuario.id) {
        setEstadoB(2);
      }
      if (bio != usuario.id) {
        setEstadoB(3);
      }
    } catch (e) {

    }
  }

  const activar = async () => {
    try {
      const res = await BiometricAuth.checkBiometry();
      if (!res.isAvailable) {
        present({message: 'Tu dispositivo no tiene biometría activa.', duration: 2000, position: 'top', color: 'danger'});
        return;
      }
      await BiometricAuth.authenticate({
        androidTitle: 'Iniciar sesion',
        reason: 'Autenticate para ingresar',
        cancelTitle: 'Cancelar',
        allowDeviceCredential: true
      });
      setBiometrico(usuario.id);
      validarBio(usuario.id);
      console.log('Biometrico puesto papu');
    } catch (err) {
      console.log(err);
      present({message: 'No se pudo activar el login biométrico.', duration: 2000, position: 'top', color: 'danger'});
    }
  }

  const desactivar = async () => {
    try {
      const res = await BiometricAuth.checkBiometry();
      if (!res.isAvailable) {
        present({message: 'Tu dispositivo no tiene biometría activa.', duration: 2000, position: 'top', color: 'danger'});
        return;
      }
      await BiometricAuth.authenticate({
        androidTitle: 'Eliminar login biometrico',
        reason: 'Autenticate para confirmar',
        cancelTitle: 'Cancelar',
        allowDeviceCredential: true
      });
      setBiometrico(null);
      setEstadoB(0);
      validarBio(null);
      console.log('Biometrico quitado papu');
    } catch (err) {
      console.log(err);
      present({message: 'No se pudo desactivar el login biométrico.', duration: 2000, position: 'top', color: 'danger'});
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
              <h2 className="!my-8">{usuario?.nombres} {usuario?.apellidos}</h2>
            </div>
            {estadoB == 1 && (
              <ButtonComponent onClick={activar} icono={fingerPrint} tipo="primary" text="Activar login biometrico" />
            )}
            {estadoB == 2 && (
              <ButtonComponent onClick={desactivar} icono={fingerPrint} tipo="error" text="Eliminar login biometrico" />
            )}
            {estadoB == 3 && (
              <ButtonComponent onClick={activar} icono={fingerPrint} tipo="primary" text="Reemplazar login biometrico" />
            )}
            <ButtonComponent onClick={cerrarSesion} icono={logOut} tipo="error" text="Cerrar sesion" />
          </motion.div>
        </AnimatePresence>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
