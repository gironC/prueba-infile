import ky from "ky";
const url = 'https://auth.infile.kinova.click';

const getCategorias = async () => {
  return await ky.get(`${url}/posts/categorias`, {}).json();
}

const getPosts = async (token: string, pagina: number, categoria?: string) => {
  return await ky.post(`${url}/posts/posts`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: {
      pagina,
      categoria: categoria || null
    }
  }).json();
}

const getRelacionados = async (token: string, id: string) => {
  return await ky.post(`${url}/posts/relacionados`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: {
      id
    }
  }).json();
}

const getPost = async (token: string, id: string) => {
  return await ky.post(`${url}/posts/post`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: {
      id
    }
  }).json();
}

const getFavoritos = async (token: string, pagina: number) => {
  return await ky.post(`${url}/posts/favoritos`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: {
      pagina
    }
  }).json();
}

const postFavorito = async (token: string, noticia: string, estado: boolean) => {
  console.log('estado', estado);
  return await ky.post(`${url}/posts/arFavoritos`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: {
      noticia,
      estado
    }
  }).json();
}

export const posts = {
  getCategorias,
  getPosts,
  getPost,
  getRelacionados,
  getFavoritos,
  postFavorito,
}