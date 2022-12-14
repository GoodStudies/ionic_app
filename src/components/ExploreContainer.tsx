import React from 'react';
import 'reflect-metadata';
import '@capacitor-community/sqlite';
import '../theme/ExploreContainer.css';
import { AppDataSource }from '../App';
import { Participant } from '../entity/Participant';
import useWindowDimensions from '../hooks/useOrientation';

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {
	// returns orientation object with width, height and isPortrait
	const orientation = useWindowDimensions();

	const sendRequest = async () => {
		try {
			const response = await fetch('https://api.goodstudies.de/question_groups/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			})
			const data = response.json();
			console.log(data);
		} catch (err: any) {
			console.log('Error: ', err);
		}
	}

	const createParticipant = async () => {
		console.log('inside createParticipant');
		const participant = AppDataSource.manager.create(Participant, {
			server_id: 1,
			firstname: "Fiodar",
			lastname: "Yuzhyk",
			birthdate: "13.06.1999"
		});
		await AppDataSource.manager.save(participant);
		console.log('saved');
		// console.log('Created participant with the name: ' + participant.firstname);
	}

	const getParticipant = async () => {
		console.log('inside getParticipant');
		const pariticipant = await AppDataSource.manager.findOneBy(Participant, {
			firstname: 'Fiodar',
		})
		console.log('participant: ' + pariticipant?.lastname);
	}

	return (
		<div className="container">
			<strong>Ready to create an app?</strong>
			<p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
			<button onClick={createParticipant}>Create Participant</button>
			<button onClick={getParticipant}>Get Particpant</button>
			<button onClick={sendRequest}>Send</button>
		</div>
	);
};

export default ExploreContainer;
