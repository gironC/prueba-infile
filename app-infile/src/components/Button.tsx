import React, { forwardRef } from 'react';
import { IonIcon, IonicSafeString } from "@ionic/react";
import { mail } from "ionicons/icons";
import "./Input.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  tipo: string;
  icono?: any;
}

const types = [
  {id: 'primary', value: 'bg-blue-700 active:bg-blue-800 text-white'},
  {id: 'secondary', value: 'bg-cyan-600 active:bg-cyan-700 text-white'},
  {id: 'error', value: 'bg-rose-600 active:bg-rose-700 text-white'},
  {id: 'google', value: '!border !border-gray-300 active:!border-gray-500 text-gray-950'}
]

const ButtonComponent: React.FC<ButtonProps> = (
  ({ text, tipo = 'primary', icono = mail, ...props }) => {
    return (
      <button className={`${types.find((item:any) => item.id == tipo)!.value} !px-8 !py-4 w-full !rounded-lg !mb-4 flex items-center justify-center disabled:bg-gray-400`} {...props}>
        <IonIcon className="text-xl" icon={icono} />&nbsp;{text}
      </button>
    );
  }
);

ButtonComponent.displayName = "ButtonComponent";

export default ButtonComponent;