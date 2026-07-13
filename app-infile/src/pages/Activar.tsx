import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IonContent, IonPage, IonButton, useIonRouter, useIonToast } from "@ionic/react";
import { person, fingerPrint } from "ionicons/icons";
import { motion, AnimatePresence } from 'motion/react'
import "./Activar.css";

import { auth } from "../api/auth";

import { useUsuarioStore } from "../store/usuario";

import OtpComponent from "../components/Otp";

const Activar: React.FC = () => {
  const [present] = useIonToast();
  const router = useIonRouter();
  const { usuario, setUsuario } = useUsuarioStore();

  const [numero, setNumero] = useState('');

  const validarOtp = async () => {
    console.log('numero', numero);
    await auth.activar(usuario.access_token, numero).then((res: any) => {
      let usr = {...usuario};
      usr.activo = true;
      setUsuario(usr);
      router.push('/dash');
    }).catch(err => {
      console.log(err);
      present({message: 'Ocurrió un error, verifica que sea un codigo valido.', duration: 2000, position: 'top'});
    });
  }
  return (
    <IonPage>
      <IonContent fullscreen>
        <AnimatePresence mode="wait">
          <motion.div key="div" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y:-20}} transition={{duration: 0.2}} className="w-full h-full flex flex-col items-center justify-center p-4">
            <p className="mb-4">Te hemos enviado un código de 6 dígitos a tu correo, ingresalo para continuar.</p>
            <OtpComponent setNumero={setNumero} clickValido={validarOtp} />
          </motion.div>
        </AnimatePresence>
      </IonContent>
    </IonPage>
  );
};

export default Activar;
