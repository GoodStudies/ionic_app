import {
  IonContent,
  IonHeader,
  IonItem,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";

const Menu: React.FC = () => {
  const navigation = useIonRouter();
  const paths = [
    { name: "Home", path: "/home" },
    { name: "Teilnehmer", path: "/participants" },
  ];

  return (
    <IonMenu contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <img src="assets/icon/logo.svg"></img>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {paths.map((item, index) => (
          <IonMenuToggle key={index}>
            <IonItem
              className="font-Heebo"
              key={index}
              onClick={() => navigation.push(item.path, "none")}
            >
              {item.name}
            </IonItem>
          </IonMenuToggle>
        ))}
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
