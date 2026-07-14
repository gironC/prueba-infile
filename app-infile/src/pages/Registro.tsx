import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IonContent, IonPage, IonButton, IonIcon, useIonToast } from "@ionic/react";
import { person, fingerPrint, mail, logoGoogle, chevronBack } from "ionicons/icons";
import { motion, AnimatePresence } from 'motion/react'
import { useIonRouter } from "@ionic/react";
import { SocialLogin } from "@capgo/capacitor-social-login";
import "./Registro.css";

import { auth } from "../api/auth";

import { useUsuarioStore } from "../store/usuario";

import InputComponent from "../components/Input";
import ButtonComponent from "../components/Button";

const Registro: React.FC = () => {
  const [present] = useIonToast();
  const router = useIonRouter();
  const { setUsuario } = useUsuarioStore();

  const nombreRef = useRef<HTMLInputElement>(null);
  const apellidoRef = useRef<HTMLInputElement>(null);
  const correoRef = useRef<HTMLInputElement>(null);
  const contraRef = useRef<HTMLInputElement>(null);

  const [nombreValido, setNombreValido] = useState(false);
  const [apellidoValido, setApellidoValido] = useState(false);
  const [correoValido, setCorreoValido] = useState(false);
  const [contraValido, setContraValido] = useState(false);

  const [vista, setVista] = useState('btns');
  const [btnLoad, setBtnLoad] = useState(false);
  const [frmValido, setFrmValido] = useState(false);

  useEffect(() => {
    console.log('hola');
    setFrmValido(false);
    if (nombreValido && apellidoValido && correoValido && contraValido) setFrmValido(true);
  }, [nombreValido, apellidoValido, correoValido, contraValido]);

  const btnRegistro = async () => {
    setBtnLoad(true);
    const nombre = nombreRef.current!.value;
    const apellido = apellidoRef.current!.value;
    const correo = correoRef.current!.value;
    const contra = contraRef.current!.value;
    await auth.registro(correo, contra, nombre, apellido).then(async (res: any) => {
      console.log('res', res);
      await auth.login(correo, contra).then((resl: any) => {
        console.log('res login', resl);
        setUsuario(resl.usuario);
        setBtnLoad(false);
        router.push('/activar', 'root', 'replace');
      }).catch(err => {
        console.log('err login', err);
        router.push('/login', 'root', 'replace');
      });
    }).catch(err => {
      console.log('error', err);
      present({message: 'Ocurrió un error al registrarte, verifica que no te has registrado antes.', duration: 3000, position: 'top', color: 'danger'});
      setBtnLoad(false);
      return;
    });
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
      const nombre = result.profile.givenName;
      const apellido = result.profile.familyName;
      const correo = result.profile.email;
      const contra = result.profile.id;
      await auth.registroGoogle(correo, contra, nombre, apellido).then(async (res: any) => {
        await auth.loginGoogle(correo).then((resl: any) => {
          console.log('res login', resl);
          setUsuario(resl.usuario);
          setBtnLoad(false);
          router.push('/dash', 'root', 'replace');
        }).catch(err => {
          router.push('/login', 'root', 'replace');
          console.log('err login', err);
        });
      }).catch(err => {
        console.log('error', err);
        present({message: 'Ocurrió un error al registrarte, verifica que no te hayas registrado anteriormente.', duration: 3000, position: 'top', color: 'danger'});
        setBtnLoad(false);
        return;
      });
    } catch (e) {
      present({message: 'Ocurrió un error al registrarte.', duration: 2000, position: 'top', color: 'danger'});
      console.log(e);
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
          <div className="grid grid-cols-3">
            <div className="col-start-2">
              <img src="https://infile.com/hs-fs/hubfs/0_Logo_Azul122.png?width=200&height=100&name=0_Logo_Azul122.png" alt="Logo" className="mb-8" />
            </div>
          </div>
          <AnimatePresence mode="wait">
            {vista == 'btns' && (
              <motion.div key="btns" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y:-20}} transition={{duration: 0.2}} className="w-full">
                <ButtonComponent text="Registrate con Google" tipo="google" icono={logoGoogle} onClick={btnGoogle} />
                <ButtonComponent text="Registro con contraseña" tipo="primary" onClick={() => setVista('manual')} />
                <p className="text-center mt-8">Ya tienes una cuenta? <Link className="!text-sky-700 active:!text-sky-800" to='/login' replace>Inicia sesion</Link></p>
              </motion.div>
            )}
            {vista == 'manual' && (
              <motion.div key="form" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y:-20}} transition={{duration: 0.2}} className="w-full">
                <button onClick={() => setVista('btns')} className="flex items-center mb-4 text-blue-600 font-bold"><IonIcon icon={chevronBack} />Regresar</button>
                <InputComponent
                  ref={nombreRef} icon={person} placeholder="Tu nombre" tipo="text"
                  errorTxt="Ingresa un nombre válido" validChange={setNombreValido}
                />
                <InputComponent
                  ref={apellidoRef} icon={person} placeholder="Tu apellido" tipo="text"
                  errorTxt="Ingresa un nombre válido" validChange={setApellidoValido}
                />
                <InputComponent
                  ref={correoRef} icon={mail} placeholder="Correo electrónico" tipo="email"
                  errorTxt="Ingresa un correo valido" validChange={setCorreoValido}
                />
                <InputComponent
                  ref={contraRef} icon={fingerPrint} placeholder="Contraseña" tipo="password"
                  errorTxt="Tu contraseña debe tener al menos 8 caractéres, una letra mayúscula, un número y un caracter especial."
                   validChange={setContraValido}
                />
                <ButtonComponent disabled={btnLoad || !frmValido} text={`${btnLoad ? 'Cargando...' : 'Registrate'}`} tipo="primary" onClick={btnRegistro} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Registro;
