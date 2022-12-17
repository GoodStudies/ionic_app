import { useEffect, useState } from "react";
import { SQLiteHook, useSQLite } from "react-sqlite-hook";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import "reflect-metadata";
import {
  CapacitorSQLite,
  SQLiteConnection,
} from "@capacitor-community/sqlite";
import { DataSource } from "typeorm";
import { Participant } from "./entity/Participant";
import { Answer } from "./entity/Answer";
import { Question } from "./entity/Question";
import { QuestionGroup } from "./entity/QuestionGroup";
import { QuestionMultipleChoice } from "./entity/QuestionMultipleChoice";
import { QuestionSubgroup } from "./entity/QuestionSubgroup";
import Participants from "./pages/Participants";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import React from "react";
import { ParticipantListContext } from "./components/ParticipantList/ParticipantListContext";

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

// initialized fixedQuestions list
const get_fixed = "https://api.goodstudies.de/questions/study/2/fixed";
export let fixedQuestions: any[] = [];
// needs to be initialized every time using the participant objects
export let participantList: Participant[] = [];

export let initialState = { list: participantList }

export const enum REDUCER_ACTION_TYPE {
	UPDATE
}

export type ReducerAction = {
	type: REDUCER_ACTION_TYPE;
}

export const reducer = (state: typeof initialState, action: ReducerAction): typeof initialState => {
	switch(action.type) {
		case REDUCER_ACTION_TYPE.UPDATE: {
			return { ...state, list: participantList }
		}
	}
}

export const initParticipantList = async () => {
  participantList = await AppDataSource.manager.find(Participant);
};

interface existingConnInterface {
  existConn: boolean;
  setExistConn: React.Dispatch<React.SetStateAction<boolean>>;
}

// export let sqlite: SQLiteHook;
export let sqlite = new SQLiteConnection(CapacitorSQLite);
export let existingConn: existingConnInterface;
export let AppDataSource: DataSource;

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

const sendRequest = async (req: string) => {
  try {
    const response = await fetch(req, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("data:" + data[0].question_name);
    return data;
  } catch (err: any) {
    console.log("Error: ", err);
    return err;
  }
};

const fetchFixedQuestions = async (req: string) => {
  sendRequest(req).then((fixed) => {
    for (let i = 0; i < fixed.length; i++) {
      fixedQuestions.push(fixed[i]);
      console.log("question: " + fixed[i].question_name);
    }
    console.log("length: " + fixed.length);
    console.log("finished");
  });
};
fetchFixedQuestions(get_fixed);

const createFixedQuestionGroup = async () => {
  let fixedQuestionGroup: QuestionGroup;
  let fixedQuestionSubgroup: QuestionSubgroup;
  let fixedQuestion: Question;
  let fixedQuestionMultipleChoice: QuestionMultipleChoice;

  fixedQuestionGroup = AppDataSource.manager.create(QuestionGroup, {
    // needs to be retrieved from the backend as well;
    id: 1,
    name: "fixedQuestionGroup",
    is_fixed: true,
    question_subgroups: [],
  });
  fixedQuestionSubgroup = AppDataSource.manager.create(QuestionSubgroup, {
    // needs to be retrieved from the backend as well;
    id: 1,
    name: "fixedQuestionSubgroup",
    questions: [],
    questionGroup: fixedQuestionGroup,
  });
  // add subgroup to group
  fixedQuestionGroup.question_subgroups.push(fixedQuestionSubgroup);
  // create the fixed questions
  for (let i = 0; i < fixedQuestions.length; i++) {
    fixedQuestion = AppDataSource.manager.create(Question, {
      id: fixedQuestions[i].id,
      question: fixedQuestions[i].question_name,
      questionSubgroup: fixedQuestionSubgroup,
      questionMultipleChoices: [],
    });
    // add the fixed question to the fixed question subgroup
    fixedQuestionSubgroup.questions.push(fixedQuestion);
    // create the multiple choices for the fixed questions
    if (fixedQuestions[i].question_multiple_choice.length > 0) {
      for (
        let j = 0;
        j < fixedQuestions[i].question_multiple_choice.length;
        j++
      ) {
        console.log("mp loop");
        fixedQuestionMultipleChoice = AppDataSource.manager.create(
          QuestionMultipleChoice,
          {
            id: fixedQuestions[i].question_multiple_choice[j].id,
            value: fixedQuestions[i].question_multiple_choice[j].value,
            question: fixedQuestion,
          }
        );
        await AppDataSource.manager.save(fixedQuestionMultipleChoice);
        fixedQuestion.questionMultipleChoices.push(fixedQuestionMultipleChoice);
      }
    }
    await AppDataSource.manager.save(fixedQuestion);
  }
  await AppDataSource.manager.save(fixedQuestionSubgroup);
  await AppDataSource.manager.save(fixedQuestionGroup);
  console.log("successfully created fixed questions group!");
};

sqlite.checkConnectionsConsistency().catch((e) => {
  console.log(e);
  return {};
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    initParticipantList();
    // createFixedQuestionGroup();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

const App: React.FC = () => {
  const [newParticipantList, setParticipantList] = useState(participantList);
  const [existConn, setExistConn] = useState(false);
  existingConn = { existConn: existConn, setExistConn: setExistConn };

  return (
	  <IonApp>
      <IonReactRouter>
			<IonRouterOutlet>
				<Route exact path="/" component={Login} />
				<Route exact path="/app" component={Menu} />
				<Route exact path="/home" component={Home} />
				<Route exact path="/participants" component={Participants} />
			</IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
