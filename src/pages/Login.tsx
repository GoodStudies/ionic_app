import {
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  useIonAlert,
  useIonLoading,
  useIonRouter,
} from "@ionic/react";
import { login } from "../api/login";
import { useForm } from "react-hook-form";
import OutlinedIconButton from "../components/OutlinedIconButton";

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [presentAlert] = useIonAlert();
  const [present, dismiss] = useIonLoading();
  const router = useIonRouter();

  const onLogin = async (data: any) => {
    present({
      message: "Einloggen...",
      spinner: "circles",
    });
    login(data).then((result) => {
      // if login successfull
      if (result) {
        dismiss();
        router.push("/participants", "forward");
        // if login failed
      } else {
        dismiss();
        presentAlert({
          header: "Fehler",
          subHeader: "Anmeldung fehlgeschlagen",
          message: "Bitte überprüfen Sie Ihre Zugangsdaten",
          buttons: ["OK"],
        });
      }
    });
  };

  return (
    <IonPage className="ion-padding grid-cols-1 justify-evenly">
      <div className="flex justify-center">
        <img src="assets/icon/login_logo.svg" width={400}></img>
      </div>
      <div className="flex justify-center">
        <IonCard>
          <IonCardContent>
            <div className="flex justify-center pb-1">
              <h1 className="text-blue-500">Willkommen!</h1>
            </div>
            <div className="flex justify-center pb-8 text-blue-500">
              <h3>Bitte melden Sie sich an</h3>
            </div>
            <IonList className="flex justify-center">
              <div>
                <IonItem lines="none">
                  <div className="pb-2">
                    <IonLabel position="stacked" color="primary">
                      Benutzername
                    </IonLabel>
                  </div>
                  <div className="border-2 border-blue-400 rounded-xl pl-2">
                    <IonInput color={"primary"} {...register("username")} />
                  </div>
                </IonItem>
                <IonItem lines="none">
                  <div className="pb-2">
                    <IonLabel position="stacked" color="primary">
                      Passwort
                    </IonLabel>
                  </div>
                  <div className="border-2 border-blue-400 rounded-xl pl-2">
                    <IonInput type="password" {...register("password")} />
                  </div>
                </IonItem>
              </div>
            </IonList>
            <div className="flex justify-center items-center pt-6">
              <IonItem lines="none" className="item text-sm" mode="ios">
                <IonCheckbox
                  className="checkbox"
                  color={"primary"}
                ></IonCheckbox>
                <IonLabel color={"primary"}>Eingeloggt bleiben</IonLabel>
              </IonItem>
              <IonItem lines="none" className="text-sm">
                <IonLabel color={"primary"} className="underline">
                  Passwort vergessen?
                </IonLabel>
              </IonItem>
            </div>
            <div className="flex justify-center pt-4">
              <OutlinedIconButton
                onClick={handleSubmit((data) => {
                  onLogin(data);
                })}
                label={"Einloggen"}
                style={"login-button"}
              ></OutlinedIconButton>
            </div>
          </IonCardContent>
        </IonCard>
      </div>
      <div></div>
    </IonPage>
  );
};

export default Login;
