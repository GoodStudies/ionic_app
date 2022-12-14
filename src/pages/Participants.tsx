import { IonButton, IonContent, IonGrid, IonList, IonPage, useIonModal } from '@ionic/react';
import PageLayout from '../components/PageLayout';
import { addCircleOutline } from 'ionicons/icons';
import OutlinedIconButton from '../components/OutlinedIconButton';
import ParticipantList from '../components/ParticipantList/ParticipantList';
import ParticipantListItem from '../components/ParticipantList/ParticipantListItem';
import { TableColumns, columnNames } from '../components/ParticipantList/TableColumns';
import { useState } from 'react';
import ParticipantModal from '../components/ParticipantModal';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import ExploreContainer from '../components/ExploreContainer';
import { AppDataSource, fixedQuestions } from '../App';
import { Question } from '../entity/Question';

export const mockParticipants = [
	{
		firstname: 'Max',
		lastname: 'Hedtmann',
		birthdate: '01.01.2000'
	},
	{
		firstname: 'Julian',
		lastname: 'Schneider',
		birthdate: '16.12.2000'
	},
	{
		firstname: 'Günter',
		lastname: 'Ficker',
		birthdate: '99.99.2000'
	},
	{
		firstname: 'Paul',
		lastname: 'Dev',
		birthdate: '22.11.2000'
	},
	{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},
	{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},
	{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},
	{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},
	{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},
	{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},
	{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},
	{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},
	{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},
	{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},
	{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},
	{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},
	{
		firstname: 'Alex',
		lastname: 'Backend',
		birthdate: '127.0.0.1'
	},
]

const queryDb = async () => {
	// const question = await AppDataSource.manager.findOne(Question, {
	// 	where: {
	// 		question: 'Weg zur Schule'
	// 	}
	// });
	// console.log('question: ' + question?.questionMultipleChoices);
	const question = fixedQuestions[11].question_multiple_choice.length;
	console.log('question: ' + question);
}

const ParticipantsTable: React.FC = () => {
	return (
		<>
			<IonGrid>
				<TableColumns columnNames={columnNames}/>
				<IonList className='participantList'>
					<ParticipantList items={mockParticipants} component={ParticipantListItem}/>
				</IonList>
			</IonGrid>
		</>
	)
}

const Participants: React.FC = () => {
	const [present, dismiss] = useIonModal(ParticipantModal, {
		onDismiss: (data: string, role: string) => dismiss(data, role),
	});
	const [message, setMessage] = useState('This modal example uses the modalController to present and dismiss modals.');

	function openModal() {
		present({
		  onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
			if (ev.detail.role === 'confirm') {
			  setMessage(`Hello, ${ev.detail.data}!]}`);
			}
		  },
		});
		console.log('opened modal');
		queryDb();
	}

	return (
		<>
			<PageLayout title='Teilnehmer Liste' content={ParticipantsTable} onClick={openModal}>
				<div className='flex justify-center pt-20'>
					<OutlinedIconButton onClick={openModal} label={'Teilnehmer hinzufuegen'} icon={addCircleOutline}/>
				</div>
				{/* <div>
					<ExploreContainer/>
				</div> */}
			</PageLayout>
		</>
	)
}

export default Participants;
