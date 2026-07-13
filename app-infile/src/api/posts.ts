import ky from "ky";
const url = 'https://dummyjson.com/posts';

const consultaInicial = async () => {
  return await ky.get(`${url}?limit=10&select=title,tags,views`, {
  }).json();
}

const consultaScroll = async (pagina: number) => {
  const siguientes = pagina * 10;
  return await ky.get(`${url}?limit=10&skip=${siguientes}`).json();
}

export const posts = {
  consultaInicial,
  consultaScroll
}