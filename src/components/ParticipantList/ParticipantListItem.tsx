import { useState } from "react";
import { useForm } from "react-hook-form";
import { bicycle, personAdd } from "ionicons/icons";
import { format, parseISO } from "date-fns";
import { Answer } from "../../entity/Answer";
import { Question } from "../../entity/Question";
import { trash, basketballOutline } from "ionicons/icons";
import { Participant } from "../../entity/Participant";
import useOrientation from "../../hooks/useOrientation";
import {
  AppDataSource,
  fixedQuestions,
  initParticipantList,
  participantList,
} from "../../App";
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
  useIonRouter,
} from "@ionic/react";
import OutlinedIconButton from "../OutlinedIconButton";
import { useParticipantList } from "./ParticipantListContext";
import { updateParticipant } from "../../db/updateParticipant";
import { useParticipant } from "../ParticipantContext";

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
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [value, setValue] = useState<string | null>("Auswaehlen");
  const { isPortrait } = useOrientation();
  const { register, handleSubmit } = useForm();
  const { setParticipantList } = useParticipantList();
  const { setSelectedParticipant } = useParticipant();
  const navigation = useIonRouter();

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
      updateParticipant(data, birthdate, participant);
      setParticipant(participant);
      setShowToast(true);
    }
    setOpen(false);
  };

  const deleteParticipant = async (participant: Participant) => {
    await AppDataSource.manager.remove(participant);
    var updatedParticipantList = participantList.filter(
      () => participant.local_id != participant.local_id
    );
    console.log("deleted && removed participant from list!");
    // update participantList and let the UI rerender
    setParticipantList(updatedParticipantList);
    initParticipantList();
  };

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

  const changePage = () => {
    console.log("changePage");
    setSelectedParticipant(participant);
    navigation.push("/questionGroups", "forward");
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
        <IonCol
          className="italic text-[#2A6BF2]"
          push="0.5"
          onClick={changePage}
        >
          aufnehmen
          <IonIcon icon={bicycle}></IonIcon>
        </IonCol>
      </IonRow>
      <IonModal
        isOpen={open}
        onDidDismiss={() => closeModal(null, value, "cancel")}
      >
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
                  onClick={handleSubmit((data) =>
                    closeModal(data, value, "save")
                  )}
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
                  <IonItem key={index}>
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
                      <button
                        className="date-picker"
                        onClick={() => setOpenDate(true)}
                      >
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
            <div className="flex justify-center mt-8">
              <OutlinedIconButton
                onClick={() =>
                  presentAlert({
                    header:
                      "Teilnehmer wirklich entfernen? Diese Aktion ist unwiederrufbar!",
                    buttons: [
                      {
                        text: "Abbrechen",
                        handler: () => {},
                      },
                      {
                        text: "Bestätigen",
                        handler: () => {
                          deleteParticipant(participant);
                          setOpen(false);
                          setShowDeleteToast(true);
                        },
                      },
                    ],
                  })
                }
                style={"custom-button-delete"}
                icon={trash}
                label={"Teilnehmer entfernen"}
              />
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
      <IonToast
        cssClass={"custom-toast"}
        isOpen={showDeleteToast}
        onDidDismiss={() => setShowDeleteToast(false)}
        message="Teilnehmer wurde erfolgreich entfernt"
        duration={2000}
      />
    </IonCard>
  );
};

export default ParticipantListItem;
