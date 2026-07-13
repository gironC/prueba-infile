import React, { ChangeEvent, forwardRef, useEffect, useState, useRef } from "react";
import { validador } from "../_utils/validadores";
import { checkbox } from "ionicons/icons";
import "./Otp.css";

import ButtonComponent from "./Button";

interface OtpProps extends React.InputHTMLAttributes<HTMLInputElement> {
  setNumero: (valor: string) => void;
  clickValido: () => void;
  validChange?: any,
}

const OtpComponent: React.FC<OtpProps> = ({ setNumero, clickValido, validChange, ...props }) => {
  const n1Ref = useRef<HTMLInputElement>(null);
  const n2Ref = useRef<HTMLInputElement>(null);
  const n3Ref = useRef<HTMLInputElement>(null);
  const n4Ref = useRef<HTMLInputElement>(null);
  const n5Ref = useRef<HTMLInputElement>(null);
  const n6Ref = useRef<HTMLInputElement>(null);  

  const [valido, setValido] = useState(false);
  const [nums, setNums] = useState<string[]>(['','','','','','']);
  function actualizarValor (valor: string, index: number) {
    let n = [...nums];
    if (valor.length > 1) {
      const t = valor[valor.length - 1];
      if (validador.entero(t)) n[index] = t;
    }
    else {
      if (validador.enteroVacio(valor)) n[index] = valor;
    }
    setNums(n);
    if (index == 0) n2Ref.current?.focus();
    if (index == 1) n3Ref.current?.focus();
    if (index == 2) n4Ref.current?.focus();
    if (index == 3) n5Ref.current?.focus();
    if (index == 4) n6Ref.current?.focus();
    if(n[0] != '' && n[1] != '' && n[2] != '' && n[3] != '' && n[4] != '' && n[5] != '') setValido(true);
    else setValido(false);
    setNumero(n[0] + n[1] + n[2] + n[3] + n[4] + n[5]);
  }
  return (
    <div className="w-full">
      <div className="mb-2 w-full grid grid-cols-6 gap-2">
        <div className="rounded-lg border border-gray-100 shadow-sm flex items-center p-2">
          <input ref={n1Ref} value={nums[0]} onChange={(e) => actualizarValor(e.target.value, 0)} type="text" className="w-full border-none outline-none text-center !font-bold !text-2xl" />
        </div>
        <div className="rounded-lg border border-gray-100 shadow-sm flex items-center p-2">
          <input ref={n2Ref} value={nums[1]} onChange={(e) => actualizarValor(e.target.value, 1)} type="text" className="w-full border-none outline-none text-center !font-bold !text-2xl" />
        </div>
        <div className="rounded-lg border border-gray-100 shadow-sm flex items-center p-2">
          <input ref={n3Ref} value={nums[2]} onChange={(e) => actualizarValor(e.target.value, 2)} type="text" className="w-full border-none outline-none text-center !font-bold !text-2xl" />
        </div>
        <div className="rounded-lg border border-gray-100 shadow-sm flex items-center p-2">
          <input ref={n4Ref} value={nums[3]} onChange={(e) => actualizarValor(e.target.value, 3)} type="text" className="w-full border-none outline-none text-center !font-bold !text-2xl" />
        </div>
        <div className="rounded-lg border border-gray-100 shadow-sm flex items-center p-2">
          <input ref={n5Ref} value={nums[4]} onChange={(e) => actualizarValor(e.target.value, 4)} type="text" className="w-full border-none outline-none text-center !font-bold !text-2xl" />
        </div>
        <div className="rounded-lg border border-gray-100 shadow-sm flex items-center p-2">
          <input ref={n6Ref} value={nums[5]} onChange={(e) => actualizarValor(e.target.value, 5)} type="text" className="w-full border-none outline-none text-center !font-bold !text-2xl" />
        </div>
      </div>
      {valido && (
        <ButtonComponent onClick={clickValido} icono={checkbox} tipo="primary" text="Validar" />
      )}
    </div>
  );
}

OtpComponent.displayName = "OtpComponent";

export default OtpComponent;