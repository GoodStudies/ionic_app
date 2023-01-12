import { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { IonReactRouter } from "@ionic/react-router";
import "reflect-metadata";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import { DataSource } from "typeorm";
import { Participant } from "./entity/Participant";
import { Answer } from "./entity/Answer";
import { Question } from "./entity/Question";
import { QuestionGroup } from "./entity/QuestionGroup";
import { QuestionMultipleChoice } from "./entity/QuestionMultipleChoice";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import { QuestionSubgroup } from "./entity/QuestionSubgroup";
import Participants from "./pages/Participants";
import React from "react";
import { Network } from "@capacitor/network";
import { fetchAndCreateStudyQuestions } from "./db/createGroups";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/tailwind.css";

/* Context Hook */
import { useParticipantList } from "./context/ParticipantListContext";

/* SplashScreen */
import { SplashScreen } from "@capacitor/splash-screen";

/* API */
import QuestionGroups from "./pages/QuestionGroups";
import Login from "./pages/Login";
import { deleteEverything } from "./db/utils";
import { createFixedQuestions } from "./db/createGroups";
import GuardedRoute from "./components/GuradedRoute";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { useQuestionGroups } from "./context/QuestionGroupsContext";

export let AppDataSource: DataSource;
export let fixedQuestions: Question[] = [];
export let participantList: Participant[] = [];
export let sqlite = new SQLiteConnection(CapacitorSQLite);

setupIonicReact();

AppDataSource = new DataSource({
  type: "capacitor",
  driver: new SQLiteConnection(CapacitorSQLite),
  database: "new_db",
  synchronize: true,
  logging: true,
  migrations: ["src/migration/**/*.ts"],
  entities: [
    Participant,
    Answer,
    Question,
    QuestionGroup,
    QuestionMultipleChoice,
    QuestionSubgroup,
  ],
});

sqlite.checkConnectionsConsistency().catch((e) => {
  console.log(e);
  return {};
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    // getAllQuestionGroups();
    // this needs to be called once, when the app is "initialized @ school"
    // fetchAndCreateStudyQuestions();
    createFixedQuestions(fixedQuestions);
    // deleteEverything();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

const App: React.FC = () => {
  const { newParticipantList, setParticipantList } = useParticipantList();
  const { questionGroups, setQuestionGroups } = useQuestionGroups();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // the network status needs to be checked every time the app is opened
  // if network == wifi and study == complete, the data should be send to the server
  Network.addListener("networkStatusChange", (status) => {
    console.log("Network status changed", status.connectionType);
  });

  useEffect(() => {
    setTimeout(async () => {
      const participantList = await AppDataSource.manager.find(Participant);
      const questionGroups = await AppDataSource.manager.find(QuestionGroup);
      setQuestionGroups(questionGroups);
      setParticipantList(participantList);
    }, 600);
	// right now, the hide call is set behind a timeout
	// but it can be driggered after everything important got fetched/created
    setTimeout(async () => {
      SplashScreen.hide().then(() => {
        console.log("HIDE SPLASHSCREEN");
      });
    }, 5000);
  }, []);

  const checkIfAuthenticated = async () => {
    try {
      await SecureStoragePlugin.get({ key: "username" });
      await SecureStoragePlugin.get({ key: "password" });
      console.log("IS AUTHENTICATED");
      setIsAuthenticated(true);
    } catch (err) {
      console.log("NOT AUTHENTICATED: ", err);
      setIsAuthenticated(false);
    }
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* <Redirect exact from="/" to={ isAuthenticated ? "/participants" : "/login" }/> */}
          <Route exact path="/" component={Participants} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/participants" component={Participants} />
          <Route exact path="/questionGroups" component={QuestionGroups} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
