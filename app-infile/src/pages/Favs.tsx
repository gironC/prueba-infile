import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IonContent, IonPage, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent, IonIcon, useIonViewWillEnter } from "@ionic/react";
import { chevronDown, heart, heartOutline } from "ionicons/icons";
import { motion, AnimatePresence, useScroll } from 'motion/react'
import "./Home.css";

import { posts } from "../api/posts";

import { useUsuarioStore } from "../store/usuario";

const Favs: React.FC = () => {
  const { usuario, loadUsuario, setLoadUsuario } = useUsuarioStore();

  const contentRef = useRef<HTMLIonContentElement>(null);
  
  const [lista, setLista] = useState<any[]>([]);
  const [pagina, setPagina] = useState(1);
  const [iniciales, setIniciales] = useState('');
  const [postSelect, setPostSelect] = useState<any>(null);
  //temporal
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    setLoadUsuario(true);
  }, []);
  
  useEffect(() => {
    if(loadUsuario) {
      llenarLista();
    }
  }, [loadUsuario]);

  useIonViewWillEnter(() => {
    contentRef.current?.scrollToTop(300);
    setPagina(1);
    llenarLista();
  });

  async function llenarLista() {
    setIniciales(usuario.nombres[0].toUpperCase() + usuario.apellidos[0].toUpperCase());
    await posts.getFavoritos(usuario.access_token, 1).then((res: any) => {
      console.log('llenado de postgres', res);
      setLista(res.lista);
    }).catch(err => {
      console.log('err postgres', err);
    });
  }

  async function paginar(e: InfiniteScrollCustomEvent) {
    let next = pagina;
    next++;
    await posts.getFavoritos(usuario.access_token, next).then((res: any) => {
      if (res.lista.length == 0) {
        e.target.complete();
        return;
      }
      setPagina(next);
      let lst = [...lista];
      lst = [...lista, ...res.lista];
      setLista(lst);
    }).catch(err => {
      console.log('err postgres', err);
    });
    e.target.complete();
  }

  async function cambiarFavorito (item: any) {
    const nuevo = {...item};
    const lst: any[] = [...lista];
    await Promise.all(lst.map((post: any) => {
      if (post.id == item.id) {
        post.es_favorito = !post.es_favorito
      }
    }));
    setLista(lst);
    await posts.postFavorito(usuario.access_token, nuevo.id, !nuevo.es_favorito).then((res: any) => {
      console.log('se cambia favorito');
    }).catch(err => {
      console.log('no se cambio');
    });
  }

  async function abrirPost(item: any) {
    console.log(item);
    setPostSelect(item);
  }

  return (
    <IonPage>
      <IonContent ref={contentRef} fullscreen>
        <AnimatePresence mode="wait">
          <motion.div key="div" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y:-20}} transition={{duration: 0.2}} className="w-full flex flex-col items-center justify-center p-4">
            <div className="w-full flex justify-between !my-8">
              <h2 className="!m-0">Favoritos</h2>
              <div className="bg-black rounded-full text-white font-semibold px-2 py-2">{iniciales}</div>
            </div>
            <ul className="w-full">
              {lista.length == 0 && (
                <div className="w-full text-gray-400 text-center text-sm">Todavía no tienes favoritos</div>
              )}
              {lista.map((item: any) => (
                <li onClick={() => abrirPost(item)} key={item.id} className="!mb-4 !rounded-xl !border border-gray-100 shadow-sm !overflow-hidden">
                  <div className="w-full aspect-[2/1] overflow-hidden flex items-center">
                    <motion.img layoutId={`img-${item.id}`} className="w-full" src={item.imagen} alt="" />
                  </div>
                  <div className="!p-4">
                    <h4 className="!mb-4 !mt-0">{item.titulo}</h4>
                    <div className="!mb-4 w-full flex justify-end">
                      {item.categorias.map((tag: any, tagI: number) => (
                        <span key={tagI} className="!py-1 !px-2 !bg-blue-600 !mr-1 !rounded-lg text-xs text-white">{tag}</span>
                      ))}
                    </div>
                    <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                      <motion.button className="border-none" onClick={() => cambiarFavorito(item)} whileTap={{scale: 0.8}} animate={{scale: item.es_favorito ? [1, 1.35, 1] : [1, 0.9, 1]}} transition={{duration: 0.5}}>
                        <IonIcon className={`text-2xl transition-colors duration-200 ${item.es_favorito ? "text-red-500" : "text-gray-400"}`} icon={item.es_favorito ? heart : heartOutline} />
                      </motion.button>
                      <span className="text-xs text-gray-500">&nbsp;Favoritos</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <IonInfiniteScroll onIonInfinite={(e) => paginar(e)}>
              <IonInfiniteScrollContent></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {postSelect && (
            <motion.div onClick={() => setPostSelect(null)} className="fixed inset-0 bg-black/70 z-50" initial={{ opacity: 0}} animate={{opacity: 1}} exit={{ opacity: 0 }}>
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="mt-20 w-full h-full overflow-y-scroll bg-white !p-4 rounded-t-xl"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
              >
                <button className="w-full" onClick={() => setPostSelect(null)}>
                  <IonIcon className="text-xl text-blue-600" icon={chevronDown} />
                </button>
                <div className="w-full aspect-square rounded-lg overflow-hidden !mb-4">
                  <motion.img
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 280, damping: 30 }}
                    layoutId={`img-${postSelect.id}`}
                    className="w-full"
                    src={postSelect.imagen}
                    alt=""
                  />
                </div>
                <h4 className="!mb-4 !mt-0">{postSelect.titulo}</h4>
                <div className="!mb-4">
                  {postSelect.categorias.map((tag: any, tagI: number) => (
                    <span key={tagI} className="!py-1 !px-2 !bg-blue-600 !mr-1 !rounded-lg text-xs text-white">{tag}</span>
                  ))}
                </div>
                <p className="mb-24">{postSelect.descripcion}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </IonContent>
    </IonPage>
  );
};

export default Favs;
