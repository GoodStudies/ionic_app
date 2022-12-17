import { useForm } from "react-hook-form";
import { personAdd } from "ionicons/icons";
import { format, parseISO } from "date-fns";
import { useEffect, useReducer, useState } from "react";
import { Answer } from "../../entity/Answer";
import { Question } from "../../entity/Question";
import { trash } from "ionicons/icons";
import { Participant } from "../../entity/Participant";
import useOrientation from "../../hooks/useOrientation";
import { AppDataSource, fixedQuestions, initParticipantList, participantList } from "../../App";
import { QuestionMultipleChoice } from "../../entity/QuestionMultipleChoice";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import OutlinedIconButton from "../OutlinedIconButton";
import { useParticipantList } from "./ParticipantListContext";

const onSubmit = async (data: any, birthdate: string | null, participant: Participant) => {
  for (let i = 0; i < fixedQuestions.length; i++) {
    // if the data field is not empty, it needs to be updated
    if (data[fixedQuestions[i].question_name] != "") {
      let question = await AppDataSource.manager.find(Question, {
        where: {
          question: fixedQuestions[i].question_name,
        },
      });
      let answer = await AppDataSource.manager.find(Answer, {
        where: {
          question: question,
          participant: participant,
        },
      });
      // check whether the answer already exists
      if (answer[answer.length - 1] != undefined) {
        // if yes, update answer
        answer[answer.length - 1].value = data[fixedQuestions[i].question_name];
        await AppDataSource.manager.save(answer[answer.length - 1]);
      } else {
        // if no, create new answer
        let new_answer = AppDataSource.manager.create(Answer, {
          question: question[question.length - 1],
          participant: participant,
          value: data[fixedQuestions[i].question_name],
        });
        await AppDataSource.manager.save(new_answer);
      }
      if (question[question.length - 1].question == "Vorname") {
        participant.firstname = data[fixedQuestions[i].question_name];
		// await AppDataSource.manager.save(participant);
      } else if (question[question.length - 1].question == "Nachname") {
        participant.lastname = data[fixedQuestions[i].question_name];
	}
}}
	// update birthdate, reagardless of whether it was updated or not
	participant.birthdate = birthdate!;
	await AppDataSource.manager.save(participant);
};

// deletes the participant in the database and removes it from the list
// const deleteParticipant = async (participant: Participant) => {
// 	await AppDataSource.manager.remove(participant).then(() => console.log('deleted participant!'));
// 	// this should filter out the participant from the list
// 	var updatedParticipantList = participantList.filter((() => participant.local_id != participant.local_id));
// 	console.log('removed participant from list!');
// 	// setParticipantList(updatedParticipantList);
// }

interface ParticipantListItemProps {
  participant: Participant;
}

const ParticipantListItem: React.FC<ParticipantListItemProps> = ({
  participant,
}) => {
  const [, setParticipant] = useState<Participant>(participant);
  const [open, setOpen] = useState(false);
  const [presentAlert] = useIonAlert();
  const [openDate, setOpenDate] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [value, setValue] = useState<string | null>("Auswaehlen");
  const { isPortrait } = useOrientation();
  const { register, handleSubmit } = useForm();
  const { newParticipantList, setParticipantList } = useParticipantList();

  const onIonChangeHandler = (value: string | string[] | null) => {
    let formattedDate = format(parseISO(value as string), "dd.MM.yyyy");
    setValue(formattedDate);
  };

  const openModal = () => {
    getAnswers(participant);
    setOpen(true);
  };

  const closeModal = (data: any, birthdate: string | null, mode: string) => {
    if (mode == "save") {
      onSubmit(data, birthdate, participant);
	  setParticipant(participant);
      setShowToast(true);
    }
    setOpen(false);
  };

  const deleteParticipant = async (participant: Participant) => {
	await AppDataSource.manager.remove(participant).then(() => console.log('deleted participant!'));
	// this should filter out the participant from the list
	var updatedParticipantList = participantList.filter((() => participant.local_id != participant.local_id));
	console.log('removed participant from list!');
	// setParticipantList(updatedParticipantList);
	setParticipantList(updatedParticipantList);
	initParticipantList();
	setOpen(false);
	console.log('used state!');
}

  const getAnswers = async (participant: Participant) => {
    let new_answers: string[] = [];
    for (let i = 0; i < fixedQuestions.length; i++) {
      const question = await AppDataSource.manager.find(Question, {
        where: {
          question: fixedQuestions[i].question_name,
        },
      });
      const answer = await AppDataSource.manager.find(Answer, {
        where: {
          participant: participant,
          question: question[0],
        },
      });
      // if answer was not provided yet
      if (answer[answer.length - 1] != undefined) {
        new_answers.push(answer[answer.length - 1].value);
      } else {
        new_answers.push("keine Angabe");
      }
    }
    setAnswers(new_answers);
  };

  return (
    <IonCard className="p-1 m-4">
      <IonRow>
        <IonCol>{participant.firstname}</IonCol>
        <IonCol>{participant.lastname}</IonCol>
        <IonCol>{participant.birthdate}</IonCol>
        <IonCol className="italic text-[#2A6BF2]" push="1" onClick={openModal}>
          bearbeiten
          <IonIcon icon={personAdd}></IonIcon>
        </IonCol>
      </IonRow>
      <IonModal isOpen={open} onDidDismiss={() => closeModal(null, value, "cancel")}>
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton
                  color="medium"
                  onClick={() => closeModal(null, value, "cancel")}
                >
                  Abbruch
                </IonButton>
              </IonButtons>
              <IonTitle>{`${participant.firstname} ${participant.lastname}`}</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={handleSubmit((data) => closeModal(data, value, "save"))}
                >
                  Speichern
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {fixedQuestions.map((question, index) =>
              question.question_multiple_choice.length > 0 ? (
                <IonList>
                  <IonItem>
                    <IonLabel position="stacked">
                      {question.question_name}
                    </IonLabel>
                    <IonSelect
                      {...register(question.question_name)}
                      interface="popover"
                      placeholder={answers[index]}
                    >
                      {question.question_multiple_choice.map(
                        (choice: QuestionMultipleChoice, index: number) => (
                          <IonSelectOption key={index} value={choice.value}>
                            {choice.value}
                          </IonSelectOption>
                        )
                      )}
                    </IonSelect>
                  </IonItem>
                </IonList>
              ) : (
                <IonItem key={index}>
                  <IonLabel position="stacked">
                    {question.question_name}
                  </IonLabel>
                  {question.question_name == "Geburtsdatum" ? (
                    <>
                      <button className="date-picker" onClick={() => setOpenDate(true)}>
                        {value == "Auswaehlen" ? participant.birthdate : value}
                      </button>
                    </>
                  ) : (
                    <IonInput
                      {...register(question.question_name)}
                      placeholder={answers[index]}
                    />
                  )}
                </IonItem>
              )
            )}
			<div className='flex justify-center mt-8'>
				<OutlinedIconButton onClick={() => presentAlert({
					header: 'Teilnehmer wirklich entfernen? Diese Aktion ist unwiederrufbar!',
					 buttons: [
						{
							text: 'Abbrechen',
							handler: () => {
								console.log('Pressed abbrechen');
							}
						},
						{
							text: 'Bestätigen',
							handler: () => {
								deleteParticipant(participant)
								console.log('Pressed bestätigen');
							}
						}
					 ],
				})} style={'custom-button-delete'} icon={trash} label={"Teilnehmer entfernen"}/>
			</div>
            <IonModal
              isOpen={openDate}
              onDidDismiss={() => setOpenDate(false)}
              className={
                isPortrait
                  ? "modal-wrapper-vertical"
                  : "modal-wrapper-horizontal"
              }
            >
              <IonDatetime
                onIonChange={(e) => onIonChangeHandler(e.detail.value || "")}
                value={value}
                size={"cover"}
                showDefaultButtons={true}
                preferWheel={true}
                presentation="date"
              />
            </IonModal>
          </IonContent>
        </IonPage>
      </IonModal>
      <IonToast
        cssClass={"custom-toast"}
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Teilnehmer wurde erfolgreich aktualisiert"
        duration={2000}
      />
    </IonCard>
  );
};

export default ParticipantListItem;
