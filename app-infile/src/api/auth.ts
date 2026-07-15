import ky from "ky";
const url = 'https://auth.infile.kinova.click';

const status = async () => {
  console.log("URL:", `${url}/health`);
  return await ky.get(`${url}/health`, {
  }).json();
}

const registro = async (correo: string, password: string, nombres:string, apellidos: string) => {
  return await ky.post(`${url}/auth/registro`, {
    json: {
      correo, password, nombres, apellidos
    }
  }).json();
}

const registroGoogle = async (correo: string, password: string, nombres:string, apellidos: string) => {
  return await ky.post(`${url}/auth/registroGoogle`, {
    json: {
      correo, password, nombres, apellidos
    }
  }).json();
}

const login = async (correo: string, password: string) => {
  return await ky.post(`${url}/auth/login`, {
    json: {
      correo, password
    }
  }).json();
}

const loginGoogle = async (correo: string) => {
  return await ky.post(`${url}/auth/loginGoogle`, {
    json: {
      correo
    }
  }).json();
}

const loginBiometrico = async (usuario: string) => {
  return await ky.post(`${url}/auth/loginBiometrico`, {
    json: {
      idUsr: usuario
    }
  }).json();
}

const activar = async (token: string, codigo: string) => {
  return await ky.post(`${url}/auth/activar`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: {
      codigo
    }
  }).json();
}

const reenviarActivacion = async (token: string) => {
  return await ky.post(`${url}/auth/reenviarActivacion`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).json();
}

const enviarReset = async (correo: string) => {
  return await ky.post(`${url}/auth/enviarReset`, {
    json: {
      correo
    }
  }).json();
}

const activarReset = async (correo: string, codigo: string) => {
  return await ky.post(`${url}/auth/enviarReset`, {
    json: {
      correo, codigo
    }
  }).json();
}

const cambiarPass = async (correo: string, password: string) => {
  return await ky.post(`${url}/auth/cambiarPass`, {
    json: {
      correo, password
    }
  }).json();
}

export const auth = {
  status,
  registro,
  registroGoogle,
  login,
  loginBiometrico,
  loginGoogle,
  activar,
  reenviarActivacion,
  enviarReset,
  activarReset,
  cambiarPass
};