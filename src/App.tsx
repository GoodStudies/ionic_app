import { useEffect, useState } from 'react';
import { SQLiteHook, useSQLite } from 'react-sqlite-hook';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import 'reflect-metadata';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { DataSource } from 'typeorm';
import { Participant } from './entity/Participant';
import { Answer } from './entity/Answer';
import { Question } from './entity/Question';
import { QuestionGroup } from './entity/QuestionGroup';
import { QuestionMultipleChoice } from './entity/QuestionMultipleChoice';
import { QuestionSubgroup } from './entity/QuestionSubgroup';
import Participants from './pages/Participants';
import Menu from './pages/Menu';
import Login from './pages/Login';
import React from 'react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/tailwind.css';

// initialized fixedQuestions list
const get_fixed = 'https://api.goodstudies.de/questions/study/2/fixed';
export let fixedQuestions: any[] = [];

interface existingConnInterface {
	existConn: boolean,
	setExistConn: React.Dispatch<React.SetStateAction<boolean>>,
}

// export let sqlite: SQLiteHook;
export let sqlite = new SQLiteConnection(CapacitorSQLite);
export let existingConn: existingConnInterface;
export let AppDataSource: DataSource;

setupIonicReact();

AppDataSource = new DataSource({
	type: 'capacitor',
	driver: new SQLiteConnection(CapacitorSQLite),
	database: 'new_db',
	// this broke everything!
	// needs to be false in production; need to figure out migrations until then
	synchronize: true,
	// logging: true,
	migrations: [
		'dist/src/db/migration/*.js'
	],
	entities: [Participant, Answer, Question, QuestionGroup, QuestionMultipleChoice, QuestionSubgroup],
});

const sendRequest = async (req: string) => {
	try {
		const response = await fetch(req, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		})
		const data = await response.json();
		console.log('data:' + data[0].question_name);
		return data;
	} catch (err: any) {
		console.log('Error: ', err);
		return err;
	}
}

const fetchFixedQuestions = async (req: string)  => {
	sendRequest(req).then((fixed) => {
		for (let i = 0; i < fixed.length; i++) {
			fixedQuestions.push(fixed[i]);
			console.log('question: ' + fixed[i].question_name);
		}
		console.log('length: ' + fixed.length);
		console.log('finished');
	})
}
fetchFixedQuestions(get_fixed);

const createFixedQuestionGroup = async () => {
	const fixedQuestionGroup = AppDataSource.manager.create(QuestionGroup, {
		name: 'fixedQuestions',
		// id doesn't matter, bc fixed is unique every time
		id: 1,
		is_fixed: true,
		question_subgroups: []
	});
	await AppDataSource.manager.save(fixedQuestionGroup);
	const fixedQuestionSubgroup = AppDataSource.manager.create(QuestionSubgroup, {
		name: 'fixedQuestionsSubgroup',
		// id doesn't matter, bc fixed is unique every time
		id: 1,
		questions:[]
	});
	for(let i = 0; i < fixedQuestions.length; i++) {
		let fixedQuestion = AppDataSource.manager.create(Question, {
			id: fixedQuestions[i].id,
			question: fixedQuestions[i].question_name,
			unit: fixedQuestions[i].unit,
			questionSubgroup: fixedQuestionSubgroup,
			questionMultipleChoices: []
	})
	// push question into questionSubgroup
	fixedQuestionSubgroup.questions.push(fixedQuestion);
	// save fixed question
	await AppDataSource.manager.save(fixedQuestion);
	}
	for(let i = 0; i < fixedQuestions.length; i++) {
		if (fixedQuestions[i].question_multiple_choice.length > 0) {
			console.log('HUHUHUHU');
			for(let j = 0; j < fixedQuestions[i].question_multiple_choice.length; j++) {
				let fixedQuestionMultipleChoice = AppDataSource.manager.create(QuestionMultipleChoice, {
					id: fixedQuestions[i].question_multiple_choice[j].id,
					value: fixedQuestions[i].question_multiple_choice[j].value,
				})
			let question = await AppDataSource.manager.findOne(Question, {
				where: {
					id: fixedQuestions[i].id
				}
			});
			//
			fixedQuestionMultipleChoice.question = question!;
			// save questionMultipleChoice
			await AppDataSource.manager.save(fixedQuestionMultipleChoice);
			// push questionMutlipleChoice into question
			// seems to create some kind of inifinite loop, why?
			fixedQuestions[i].question_multiple_choice.push(fixedQuestionMultipleChoice);
			}
		}
	}
	// push subgroup into group
	await AppDataSource.manager.save(fixedQuestionSubgroup);
	fixedQuestionGroup.question_subgroups.push(fixedQuestionSubgroup);
	console.log('successfully created fixed questions group!');
}

sqlite.checkConnectionsConsistency().catch((e) => {
	console.log(e);
	return {};
})

AppDataSource.initialize()
.then(() => {
	console.log("Data Source has been initialized!");
	createFixedQuestionGroup();
})
.catch((err) => {
	console.error("Error during Data Source initialization", err);
});

const App: React.FC = () => {
	const [existConn, setExistConn] = useState(false);
	existingConn = {existConn: existConn, setExistConn: setExistConn};

	return (
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
					<Route exact path="/" component={Login}/>
					<Route exact path="/app" component={Menu}/>
					<Route exact path="/home" component={Home}/>
					<Route exact path="/participants" component={Participants}/>
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
	);
}

export default App;
