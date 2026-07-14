import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton } from "@ionic/react";
import { IonIcon, IonLabel } from "@ionic/react";
import { person, layers, star } from "ionicons/icons";
import { Route, Redirect } from "react-router-dom";

import Perfil from "./pages/Perfil";
import Home from "./pages/Home";
import Favs from "./pages/Favs";

const Tabs:React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="/dash/posts" component={Home} exact />
      <Route path="/dash/favs" component={Favs} exact />
      <Route path="/dash/perfil" component={Perfil} exact />
      <Route path="/dash" exact><Redirect to='/dash/posts'></Redirect></Route>
    </IonRouterOutlet>
    <IonTabBar slot="bottom" style={{ boxShadow: '0 -8px 12px rgba(0, 0, 0, 0.2)' }}>
      <IonTabButton tab="posts" href="/dash/posts">
        <IonIcon icon={layers} />
        <IonLabel>Inicio</IonLabel>
      </IonTabButton>
      <IonTabButton tab="favs" href="/dash/favs">
        <IonIcon icon={star} />
        <IonLabel>Favoritos</IonLabel>
      </IonTabButton>
      <IonTabButton tab="perfil" href="/dash/perfil">
        <IonIcon icon={person} />
        <IonLabel>Perfil</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default Tabs;