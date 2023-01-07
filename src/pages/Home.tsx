import {
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonToast,
  useIonAlert,
  useIonLoading,
  useIonRouter,
} from "@ionic/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginRequest } from "../api/endpoints";
import OutlinedIconButton from "../components/OutlinedIconButton";

const Home: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [presentAlert] = useIonAlert();
  const [present, dismiss] = useIonLoading();
  const navigation = useIonRouter();

  const login = async (body: any) => {
    try {
      const response = await fetch(loginRequest, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.status == 200) {
        const result = await response.json();
        // save the credentials
        localStorage.setItem("username", body.username);
        localStorage.setItem("password", body.password);
        // save the access_token
        localStorage.setItem("token", result.access_token);
		loginSuccess();
      } else {
        loginFailed();
      }
      // const jwtToken = localStorage.getItem("token");
    } catch (err) {
      console.log("Error during login: ", err);
    }
  };

  const loginFailed = async () => {
    present({
      message: "Einloggen...",
      duration: 1000,
      spinner: "circles",
    }).then(() => {
      setTimeout(() =>
        presentAlert({
          header: "Fehler",
          subHeader: "Anmeldung fehlgeschlagen",
          message: "Bitte überprüfen Sie Ihre Zugangsdaten",
          buttons: ["OK"],
        }), 1200
      );
    });
  };

  const loginSuccess = async () => {
    present({
		message: "Einloggen...",
		duration: 1000,
		spinner: "circles",
	}).then(() => {
		setTimeout(() => navigation.push("/participants", "forward"), 1200);
	})
  }

  // called if request returns 401 => if (response.status == 401)
  const reauthenticate = async () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const response = await fetch(loginRequest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        rememberMe: false,
      }),
    });
    const result = await response.json();
    localStorage.setItem("token", result.access_token);
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
                  <IonLabel position="stacked" color="primary">
                    Benutzername
                  </IonLabel>
                  <div className="border-2 border-blue-400 rounded-xl pl-2">
                    <IonInput color={"primary"} {...register("username")} />
                  </div>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel position="stacked" color="primary">
                    Passwort
                  </IonLabel>
                  <div className="border-2 border-blue-400 rounded-xl pl-2">
                    <IonInput type="password" {...register("password")} />
                  </div>
                </IonItem>
              </div>
            </IonList>
            <div className="flex justify-center pt-6">
              <IonItem lines="none" className="item text-sm">
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
                  login(data);
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

export default Home;
