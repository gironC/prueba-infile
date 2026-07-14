import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IonContent, IonPage, IonButton, useIonRouter, useIonToast } from "@ionic/react";
import { person, fingerPrint, mail } from "ionicons/icons";
import { motion, AnimatePresence } from 'motion/react'
import "./Activar.css";

import { auth } from "../api/auth";

import { useUsuarioStore } from "../store/usuario";

import InputComponent from "../components/Input";
import ButtonComponent from "../components/Button";
import OtpComponent from "../components/Otp";

const ResetPw: React.FC = () => {
  const [present] = useIonToast();
  const router = useIonRouter();
  const { usuario, setUsuario } = useUsuarioStore();

  const correoRef = useRef<HTMLInputElement>(null);
  const contraRef = useRef<HTMLInputElement>(null);

  const [correoValido, setCorreoValido] = useState(false);
  const [contraValido, setContraValido] = useState(false);

  const [numero, setNumero] = useState('');
  const [vista, setVista] = useState('correo');
  const [btnLoad, setBtnLoad] = useState(false);
  const [frmValido, setFrmValido] = useState(false);
  const [corr, setCorr] = useState('');

  useEffect(() => {
    setFrmValido(false);
    if(correoValido) setFrmValido(true);
  }, [correoValido]);

  useEffect(() => {
    setFrmValido(false);
    if(contraValido) setFrmValido(true);
  }, [contraValido]);

  const btnCorreo = async () => {
    setBtnLoad(true);
    await auth.enviarReset(correoRef.current!.value).then((res: any) => {
      setCorr(correoRef.current!.value);
      setVista('otp');
    }).catch(err => {
      console.log(err);
      present({message: 'Ocurrió un error, verifica que estes registrado.', duration: 2000, position: 'top', color: 'danger'});
    });
    setBtnLoad(false);
  }

  const validarOtp = async () => {
    console.log('numero', numero);
    await auth.activarReset(corr, numero).then((res: any) => {
      setVista('pass');
    }).catch(err => {
      present({message: 'Ocurrió un error, verifica que sea un codigo valido.', duration: 2000, position: 'top', color: 'danger'});
      console.log(err);
    });
  }

  const btnReset = async () => {
    setBtnLoad(true);
    await auth.cambiarPass(corr, contraRef.current!.value).then((res: any) => {
      router.push('/login', 'root', 'replace');
    }).catch(err => {
      console.log(err);
      present({message: 'Ocurrió un error al restablecer tu contraseña.', duration: 2000, position: 'top', color: 'danger'});
    });
    setBtnLoad(false);
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <AnimatePresence mode="wait">
          {vista == 'correo' && (
            <motion.div key="div" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y:-20}} transition={{duration: 0.2}} className="w-full h-full flex flex-col items-center justify-center p-4">
              <InputComponent
                ref={correoRef} icon={mail} placeholder="Correo electrónico" tipo="email"
                errorTxt="Ingresa un correo valido" validChange={setCorreoValido}
              />
              <ButtonComponent disabled={btnLoad || !frmValido} text={`${btnLoad ? 'Cargando...' : 'Continuar'}`} tipo="primary" onClick={btnCorreo} />
            </motion.div>
          )}
          {vista == 'otp' && (
            <motion.div key="div" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y:-20}} transition={{duration: 0.2}} className="w-full h-full flex flex-col items-center justify-center p-4">
              <p className="mb-4">Te hemos enviado un código de 6 dígitos a tu correo, ingresalo para continuar.</p>
              <OtpComponent setNumero={setNumero} clickValido={validarOtp} />
            </motion.div>
          )}
          {vista == 'pass' && (
            <motion.div key="div" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y:-20}} transition={{duration: 0.2}} className="w-full h-full flex flex-col items-center justify-center p-4">
              <InputComponent
                ref={contraRef} icon={fingerPrint} placeholder="Contraseña" tipo="password"
                errorTxt="Tu contraseña debe tener al menos 8 caractéres, una letra mayúscula, un número y un caracter especial."
                  validChange={setContraValido}
              />
              <ButtonComponent disabled={btnLoad || !frmValido} text={`${btnLoad ? 'Cargando...' : 'Registrate'}`} tipo="primary" onClick={btnReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </IonContent>
    </IonPage>
  );
};

export default ResetPw;
