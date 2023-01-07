import { useEffect } from "react";
import { Route } from "react-router-dom";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import "reflect-metadata";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import { DataSource } from "typeorm";
import { Participant } from "./entity/Participant";
import { Answer } from "./entity/Answer";
import { Question } from "./entity/Question";
import { QuestionGroup } from "./entity/QuestionGroup";
import { QuestionMultipleChoice } from "./entity/QuestionMultipleChoice";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { QuestionSubgroup } from "./entity/QuestionSubgroup";
import Participants from "./pages/Participants";
import Menu from "./pages/Menu";
import React from "react";

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
import { useParticipantList } from "./components/ParticipantList/ParticipantListContext";

/* API */
import { fetchFixedQuestions } from "./api/getRequests";
import { get_fixed } from "./api/endpoints";
import QuestionGroups from "./pages/QuestionGroups";
import { fetchAndCreateStudyQuestions } from "./db/createGroups";

export let AppDataSource: DataSource;
export let fixedQuestions: any[] = [];
export let participantList: Participant[] = [];
export let sqlite = new SQLiteConnection(CapacitorSQLite);
export let groups: QuestionGroup[] = [];

setupIonicReact();

AppDataSource = new DataSource({
  type: "capacitor",
  driver: new SQLiteConnection(CapacitorSQLite),
  database: "new_db",
  // this broke everything!
  // needs to be false in production; need to figure out migrations until then
  synchronize: true,
  logging: true,
  migrations: ["dist/src/db/migration/*.js"],
  entities: [
    Participant,
    Answer,
    Question,
    QuestionGroup,
    QuestionMultipleChoice,
    QuestionSubgroup,
  ],
});

export const initParticipantList = async () => {
  participantList = await AppDataSource.manager.find(Participant);
};
fetchFixedQuestions(get_fixed);

export const getAllQuestionGroups = async () => {
  groups = await AppDataSource.manager.find(QuestionGroup);
};

sqlite.checkConnectionsConsistency().catch((e) => {
  console.log(e);
  return {};
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    initParticipantList();
    getAllQuestionGroups();
    // this needs to be called once, when the app is "initialized @ school"
    fetchAndCreateStudyQuestions();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

const App: React.FC = () => {
  const { setParticipantList } = useParticipantList();

  useEffect(() => {
    setParticipantList(participantList);
  }, [participantList]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={Participants} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/participants" component={Participants} />
          <Route exact path="/questionGroups" component={QuestionGroups} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
