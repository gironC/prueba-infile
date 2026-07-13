const texto = (texto: string) => {
  const reg = /^[A-Za-zÀ-ÿ0-9,._\- ]+$/;
  if(reg.test(texto)) return true;
  return false;
}

const textoVacio = (texto: string) => {
  const reg = /^[A-Za-zÀ-ÿ0-9,._\- ]*$/;
  if(reg.test(texto)) return true;
  return false;
}

const entero = (texto: string) => {
  const reg = /^[0-9]+$/;
  if(reg.test(texto)) return true;
  return false;
}

const enteroVacio = (texto: string) => {
  const reg = /^[0-9]*$/;
  if(reg.test(texto)) return true;
  return false;
}

const decimal = (texto: string) => {
  const reg = /^[0-9]+(\.[0-9]+)?$/;
  if(reg.test(texto)) return true;
  return false;
}

const decimalVacio = (texto: string) => {
  const reg = /^([0-9]+(\.[0-9]+)?)?$/;
  if(reg.test(texto)) return true;
  return false;
}

const correo = (texto: string) => {
  // uno o mas alfanumericos con puntos y guiones
  // arroba
  // un alfanumerico, mas guion y alfanumericos opcionales que deben terminar en alfanumerico
  // punto y la secuencia anterior
  // punto y alfanumericos
  const reg = /^[A-Za-z0-9._\-]+@[A-Za-z0-9]([A-Za-z0-9_\-]*[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9_\-]*[A-Za-z0-9])?)*\.[A-Za-z]+$/;
  if(reg.test(texto)) return true;
  return false;
}

const correoVacio = (texto: string) => {
  // uno o mas alfanumericos con puntos y guiones
  // arroba
  // un alfanumerico, mas guion y alfanumericos opcionales que deben terminar en alfanumerico
  // punto y la secuencia anterior
  // punto y alfanumericos
  const reg = /^([A-Za-z0-9._\-]+@[A-Za-z0-9]([A-Za-z0-9_\-]*[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9_\-]*[A-Za-z0-9])?)*\.[A-Za-z]+)?$/;
  if(reg.test(texto)) return true;
  return false;
}

const contra = (texto: string) => {
  const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\.,_\-\*\+\?!@$ ])[A-Za-zÀ-ÿ0-9\.,_\-\*\+\?!@$ ]{8,}$/;
  if(reg.test(texto)) return true;
  return false;
}

export const validador = {
  texto,
  textoVacio,
  entero,
  enteroVacio,
  decimal,
  decimalVacio,
  correo,
  correoVacio,
  contra,
};