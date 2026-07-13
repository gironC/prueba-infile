import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IonContent, IonPage, IonButton, IonIcon, useIonRouter, useIonToast } from "@ionic/react";
import { person, fingerPrint, logoGoogle, chevronBack, mail } from "ionicons/icons";
import { motion, AnimatePresence } from 'motion/react';
import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";
import { SocialLogin } from "@capgo/capacitor-social-login";
import "./Login.css";

import { useUsuarioStore } from "../store/usuario";
import { useBiometricoStore } from "../store/biometrico";

import { auth } from "../api/auth";

import InputComponent from "../components/Input";
import ButtonComponent from "../components/Button";

const Login: React.FC = () => {
  const [present] = useIonToast();
  const router = useIonRouter();
  const { usuario, setUsuario, loadUsuario, setLoadUsuario } = useUsuarioStore();
  const { biometrico, setBiometrico } = useBiometricoStore();
  const correoRef = useRef<HTMLInputElement>(null);
  const contraRef = useRef<HTMLInputElement>(null);

  const [correoValido, setCorreoValido] = useState(false);
  const [contraValido, setContraValido] = useState(false);

  const [vista, setVista] = useState('btns');
  const [btnLoad, setBtnLoad] = useState(false);
  const [frmValido, setFrmValido] = useState(false);

  useEffect(() => {

  }, []);

  useEffect(() => {
    setFrmValido(false);
    if (correoValido && contraValido) setFrmValido(true);
  }, [correoValido, contraValido]);

  async function validarBiometria () {
    try {
      if (!biometrico) {
        present({message: 'No tienes el login biométrico configurado.', duration: 2000, position: 'top'});
        console.log('no hay biometrico configurado');
        return;
      }
      const res = await BiometricAuth.checkBiometry();
      if (!res.isAvailable) {
        present({message: 'No has configurado biometría en tu dispositivo.', duration: 2000, position: 'top'});
        return;
      }
      await BiometricAuth.authenticate({
        androidTitle: 'Iniciar sesion',
        reason: 'Autenticate para ingresar',
        cancelTitle: 'Cancelar',
        allowDeviceCredential: true
      });
      await auth.loginBiometrico(biometrico).then((resl: any) => {
        console.log('res login', resl);
        setUsuario(resl.usuario);
        setBtnLoad(false);
        if (resl.usuario.activo) {
          router.push('/dash', 'root', 'replace');
        } else {
          router.push('/activar', 'root', 'replace');
        }
      }).catch(err => {
        console.log('err login', err);
      });
    } catch (err) {
      present({message: 'Ocurrió un error al iniciar sesión.', duration: 2000, position: 'top'});
      console.log(err);
    }
  }

  const btnLogin = async () => {
    setBtnLoad(true);
    const correo = correoRef.current!.value;
    const contra = contraRef.current!.value;
    await auth.login(correo, contra).then((resl: any) => {
      console.log('res login', resl);
      setUsuario(resl.usuario);
      setBtnLoad(false);
      if (resl.usuario.activo) {
        router.push('/dash', 'root', 'replace');
      } else {
        router.push('/activar', 'root', 'replace');
      }
    }).catch(err => {
      present({message: 'Ocurrió un error al iniciar sesión, verifica tus datos', duration: 2000, position: 'top'});
      console.log('err login', err);
    });
    setBtnLoad(false);
  }

  const btnGoogle = async () => {
    try {
      const login = await SocialLogin.login({
        provider: 'google',
        options: {
        }
      });
      console.log(JSON.stringify(login));
      const result: any = login.result;
      const correo = result.profile.email;
      await auth.loginGoogle(correo).then((resl: any) => {
        console.log('res login', resl);
        setUsuario(resl.usuario);
        setBtnLoad(false);
        router.push('/dash', 'root', 'replace');
      }).catch(err => {
        present({message: 'Ocurrió un error al iniciar sesión, verifica que ya te hayas registrado.', duration: 2000, position: 'top'});
        console.log('err login', err);
      });
    } catch (e) {
      present({message: 'Ocurrió un error al iniciar sesión.', duration: 2000, position: 'top'});
      console.log(e);
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <AnimatePresence mode="wait">
          <motion.div key="div" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y:-20}} transition={{duration: 0.2}} className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="grid grid-cols-3">
              <div className="col-start-2">
                <img src="https://infile.com/hs-fs/hubfs/0_Logo_Azul122.png?width=200&height=100&name=0_Logo_Azul122.png" alt="Logo" className="mb-4" />
              </div>
            </div>
            {vista == 'btns' && (
              <motion.div key="btns" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y:-20}} transition={{duration: 0.2}} className="w-full">
                <ButtonComponent text="Login con Google" tipo="google" icono={logoGoogle} onClick={btnGoogle} />
                <ButtonComponent text="Login con credenciales" tipo="primary" onClick={() => setVista('manual')} />
                <ButtonComponent text="Login biometrico" tipo="google" icono={fingerPrint} onClick={() => validarBiometria()} />
                <p className="text-center mt-8">¿Olvidaste tu contraseña? <Link className="!text-sky-700 active:!text-sky-800" to='/resetpw' replace>Recuperala</Link></p>
                <p className="text-center mt-4">¿No tienes una cuenta? <Link className="!text-sky-700 active:!text-sky-800" to='/registro' replace>Registrate</Link></p>
              </motion.div>
            )}
            {vista == 'manual' && (
              <motion.div key="form" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y:-20}} transition={{duration: 0.2}} className="w-full">
                <button onClick={() => setVista('btns')} className="flex items-center mb-4 text-blue-600 font-bold"><IonIcon icon={chevronBack} />Regresar</button>
                <InputComponent ref={correoRef} validChange={setCorreoValido} icon={mail} placeholder="Correo" tipo="email" errorTxt="Ingresa un correo valido" />
                <InputComponent ref={contraRef} validChange={setContraValido} icon={fingerPrint} placeholder="Contraseña" tipo="password" errorTxt="Tu contraseña debe tener al menos 8 caractéres, una letra mayúscula, un número y un caracter especial." />
                <ButtonComponent disabled={btnLoad || !frmValido} text={`${btnLoad ? 'Cargando...' : 'Iniciar sesion'}`} tipo="primary" onClick={btnLogin} />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </IonContent>
    </IonPage>
  );
};

export default Login;
