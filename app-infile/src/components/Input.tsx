import React, { ChangeEvent, forwardRef, useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import "./Input.css";
import { validador } from "../_utils/validadores";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: any;
  placeholder: string;
  tipo: string;
  validChange?: any,
  pass?: string,
  errorTxt?: string
}

const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, placeholder, tipo = "text", validChange, pass, errorTxt, ...props }, ref) => {
    const [tipoI, setTipoI] = useState('text');
    const [mostrarPass, setMostrarPass] = useState(false);
    const [valido, setValido] = useState(true);
    useEffect(() => {
      if(tipo == 'int' || tipo == 'decimal') setTipoI('number');
      else if (tipo == 'text' || tipo == 'textE') setTipoI('text');
      else if (tipo == 'email') setTipoI('email');
      else if (tipo == 'password' || tipo == 'confirm') setTipoI('password');
    }, []);
    const changeTxt = (e: ChangeEvent<HTMLInputElement>) => {
      const valido = validarTipo(e.target.value);
      setValido(valido);
      validChange(valido);
    }
    function validarTipo(texto: string) {
      if(tipo == 'text') return validador.texto(texto);
      if(tipo == 'textE') return validador.textoVacio(texto);
      if(tipo == 'int') return validador.entero(texto);
      if(tipo == 'email') return validador.correo(texto);
      if(tipo == 'password') return validador.contra(texto);
      if(tipo == 'confirm') {
        console.log({texto, pass});
        return texto == pass;
      }
      return false;
    }
    return (
      <div className="mb-4 w-full">
        <div className="w-full rounded-lg border border-gray-100 shadow-sm flex items-center px-2 py-3 transition-all duration-500 focus-within:border-blue-600">
          <IonIcon icon={icon} className="text-2xl mr-2 text-gray-500" />
          <input
            ref={ref}
            placeholder={placeholder}
            type={tipoI == 'password' ? mostrarPass ? 'text' : 'password' : tipoI}
            className="flex-grow border-none outline-none"
            onChange={changeTxt}
            {...props}
          />
          {(tipo == 'password' || tipo == 'confirm') && (
            <button
              onClick={() => setMostrarPass(!mostrarPass)}
              className="!px-2 !text-sky-700 active:!text-sky-800"
            >
              <IonIcon
                className="text-xl" icon={mostrarPass ? eyeOffOutline : eyeOutline}
              />
            </button>
          )}
        </div>
        {!valido && (
          <p className="text-xs text-rose-600 mt-1">* {errorTxt}</p>
        )}
      </div>
    );
  }
);

InputComponent.displayName = "InputComponent";

export default InputComponent;