import { IonButton, IonContent, IonGrid, IonList, IonPage, IonToast, useIonModal } from '@ionic/react';
import PageLayout from '../components/PageLayout';
import { addCircleOutline } from 'ionicons/icons';
import OutlinedIconButton from '../components/OutlinedIconButton';
import ParticipantList from '../components/ParticipantList/ParticipantList';
import ParticipantListItem from '../components/ParticipantList/ParticipantListItem';
import { TableColumns, columnNames } from '../components/ParticipantList/TableColumns';
import { useEffect, useState } from 'react';
import ParticipantModal from '../components/ParticipantModal';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import ExploreContainer from '../components/ExploreContainer';
import { AppDataSource, fixedQuestions, sqlite, participantList } from '../App';
import { Question } from '../entity/Question';
import { QuestionSubgroup } from '../entity/QuestionSubgroup';
import { QuestionGroup } from '../entity/QuestionGroup';
import { QuestionMultipleChoice } from '../entity/QuestionMultipleChoice';
import { SQLiteDBConnection } from 'react-sqlite-hook';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { Answer } from '../entity/Answer';
import { Participant } from '../entity/Participant';

const queryDb = async () => {
	// const conn = new SQLiteDBConnection('new_db', false, CapacitorSQLite);
	// conn.delete().then(() => {
	// console.log('deleted db!');
	// });
	const test = await AppDataSource.manager.find(Question, {
		where: {
			question: 'Nachname',
		}
	});
	console.log('length: ' + test.length);
	// const test = fixedQuestions[13].question_multiple_choice[0].value;
	// console.log('length: ' + test);
}

const ParticipantsTable: React.FC = () => {
	return (
		<>
			<IonGrid>
				<TableColumns columnNames={columnNames}/>
				<IonList className='participantList'>
					<ParticipantList items={participantList} component={ParticipantListItem}/>
				</IonList>
			</IonGrid>
		</>
	)
}

const Participants: React.FC = () => {
	const [present, dismiss] = useIonModal(ParticipantModal, {
		onDismiss: (data: string, role: string) => dismiss(data, role),
		participantList: participantList,
	});
	const [message, setMessage] = useState('This modal example uses the modalController to present and dismiss modals.');
	const [showToast, setShowToast] = useState(false);

	function openModal() {
		present({
		  onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
			if (ev.detail.role === 'confirm') {
			  setMessage(`Hello, ${ev.detail.data}!]}`);
			  setShowToast(true);
			}
		  },
		});
		console.log('opened modal');
		// queryDb();
	}

	return (
		<>
			<PageLayout title='Teilnehmer Liste' content={ParticipantsTable} onClick={openModal}>
				<div className='flex justify-center pt-20'>
					<OutlinedIconButton onClick={openModal} label={'Teilnehmer hinzufuegen'} icon={addCircleOutline}/>
				</div>
				<IonToast
						cssClass={'custom-toast'}
						isOpen={showToast}
						onDidDismiss={() => setShowToast(false)}
						message="Teilnehmer wurde erfolgreich gespeichert"
						duration={2000}
				/>
			</PageLayout>
		</>
	)
}

export default Participants;
