import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

interface PageLayoutProps {
  children?: React.ReactNode;
  onClick?: () => void;
  title: string;
  content: any;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  onClick,
  title,
  content: Content,
}) => {
  return (
    <>
      <IonPage id="main">
        <IonHeader>
          <IonToolbar mode="ios">
              <button className="menu ml-2 mt-1 w-8">svg</button>
            <IonTitle>{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <Content onClick={onClick} />
          {children}
        </IonContent>
      </IonPage>
    </>
  );
};

export default PageLayout;
