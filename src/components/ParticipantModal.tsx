import { AppDataSource, fixedQuestions } from '../App';
import { useForm } from "react-hook-form";
import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { QuestionGroup } from '../entity/QuestionGroup';
import { Question } from '../entity/Question';

const ParticipantModal = ({
		onDismiss,
	}: {
		onDismiss: (data?: string | null | undefined | number, role?: string) => void;
	}) => {
	const { register, handleSubmit } = useForm();

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton color="medium" onClick={() => onDismiss(null, 'cancel')}>
							Abbruch
						</IonButton>
					</IonButtons>
						<IonTitle>Teilnehmer</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={() => handleSubmit}>Speichern</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
			{
				fixedQuestions.map((question, index) => (
				<IonItem key={index}>
					<IonLabel position='stacked'>{question.question_name}</IonLabel>
					<IonInput {...register(question.question_name)} placeholder={question.question_name}/>
				</IonItem>
			))
			}
			</IonContent>
		</IonPage>
	);
};

export default ParticipantModal;