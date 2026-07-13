import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IonContent, IonPage, IonButton, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent } from "@ionic/react";
import { person, fingerPrint } from "ionicons/icons";
import { motion, AnimatePresence, useScroll } from 'motion/react'
import "./Home.css";

import { posts } from "../api/posts";

import { useUsuarioStore } from "../store/usuario";

const Home: React.FC = () => {
  const { usuario, loadUsuario, setLoadUsuario } = useUsuarioStore();
  
  const [lista, setLista] = useState<any[]>([]);
  const [pagina, setPagina] = useState(0);
  const [iniciales, setIniciales] = useState('');

  useEffect(() => {
    setLoadUsuario(true);
    llenarLista();
  }, []);

  useEffect(() => {
    if(loadUsuario) {
    }
  }, [loadUsuario])

  async function llenarLista() {
    await posts.consultaInicial().then((res: any) => {
      console.log('res', res);
      setLista(res.posts);
    }).catch(err => {
      console.log(err);
    })
  }

  async function paginar(e: InfiniteScrollCustomEvent) {
    console.log('xd');
    let next = pagina;
    next++;
    setPagina(next);
    await posts.consultaScroll(next).then((res: any) => {
      console.log('siguientes', res);
      let lst = [...lista];
      lst = [...lista, ...res.posts];
      setLista(lst);
    }).catch(err => {
      console.log(err);
    });
    e.target.complete();
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <AnimatePresence mode="wait">
          <motion.div key="div" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y:-20}} transition={{duration: 0.2}} className="w-full flex flex-col items-center justify-center p-4">
            <div className="w-full">
              <h2 className="!mt-16">{usuario?.nombres} {usuario?.apellidos}</h2>
              <h4 className="!mb-8">Bienvenido</h4>
            </div>
            <ul className="w-full">
              {lista.map((item: any, index: number) => (
                <li key={index} className="!mb-4 !px-4 !rounded-xl !border border-gray-100 shadow-sm">
                  <h4 className="!mb-4">{item.title}</h4>
                  <div className="!mb-4">
                    {item.tags.map((tag: any, tagI: number) => (
                      <span key={tagI} className="!p-1 !px-2 !bg-blue-600 !m-1 !rounded-lg text-xs text-white">{tag}</span>
                    ))}
                  </div>
                  <p className="mb-2">{item.views} views</p>
                </li>
              ))}
            </ul>
            <IonInfiniteScroll onIonInfinite={(e) => paginar(e)}>
              <IonInfiniteScrollContent></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </motion.div>
        </AnimatePresence>
      </IonContent>
    </IonPage>
  );
};

export default Home;
