import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { trash } from "ionicons/icons";
import { useForm } from "react-hook-form";
import { AppDataSource, initParticipantList, participantList } from "../../App";
import { updateParticipant } from "../../db/updateParticipant";
import { Participant } from "../../entity/Participant";
import { QuestionMultipleChoice } from "../../entity/QuestionMultipleChoice";
import OutlinedIconButton from "../OutlinedIconButton";
import { useParticipantList } from "./ParticipantListContext";
import useOrientation from "../../hooks/useOrientation";
import { getAnswers } from "../../db/queryDb";

interface ModalProps {
  participant: Participant;
  fixedQuestions: any[];
  dismiss: (mode: string) => void;
}

const EditParticipantModal: React.FC<ModalProps> = ({
  participant,
  fixedQuestions,
  dismiss,
}) => {
  const [date, setDate] = useState<any>();
  const [formattedDate, setFormattedDate] = useState<string | null>(
    participant.birthdate
  );
  const { isPortrait } = useOrientation();
  const { register, handleSubmit } = useForm();
  const [answers, setAnswers] = useState<string[]>([]);
  const [openDate, setOpenDate] = useState(false);
  const [presentAlert] = useIonAlert();
  const { setParticipantList } = useParticipantList();

  const onSubmit = async (
    data: any,
    birthdate: string | null,
    mode: string
  ) => {
    if (mode == "save") {
      updateParticipant(data, birthdate, participant).then(() => {
        dismiss("save");
      });
    } else if (mode == "delete") {
      deleteParticipant(participant).then(() => {
        dismiss("delete");
      });
    } else {
      dismiss("cancel");
    }
  };

  const onIonChangeHandler = (value: string | string[] | null) => {
    setDate(value);
    let formattedDate = format(parseISO(value as string), "dd.MM.yyyy");
    setFormattedDate(formattedDate);
  };

  const deleteParticipant = async (participant: Participant) => {
    await AppDataSource.manager.remove(participant);
    initParticipantList().then(() => {
      setParticipantList(participantList);
    });
  };

  useEffect(() => {
    const defineAnswers = async () => {
      setAnswers(await getAnswers(participant, fixedQuestions));
    };
    defineAnswers();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar mode="ios">
          <IonButtons slot="start">
            <IonButton
              color="medium"
              onClick={() => onSubmit(null, formattedDate, "cancel")}
            >
              Abbruch
            </IonButton>
          </IonButtons>
          <IonTitle>{`${participant.firstname} ${participant.lastname}`}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={handleSubmit((data) =>
                onSubmit(data, formattedDate, "save")
              )}
            >
              Speichern
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {fixedQuestions.map((question, index) =>
          question.multiple_choices.length > 0 ? (
            <IonList key={index}>
              <IonItem key={index}>
                <IonLabel position="stacked">{question.question_name}</IonLabel>
                <IonSelect
                  {...register(question.question_name)}
                  interface="popover"
                  placeholder={answers[index]}
                >
                  {question.multiple_choices.map(
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
              <IonLabel position="stacked">{question.question_name}</IonLabel>
              {question.question_name == "Geburtsdatum" ? (
                <>
                  <button
                    className="date-picker"
                    onClick={() => setOpenDate(true)}
                  >
                    {formattedDate}
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
        <IonModal
          isOpen={openDate}
          onDidDismiss={() => setOpenDate(false)}
          className={
            isPortrait ? "modal-wrapper-vertical" : "modal-wrapper-horizontal"
          }
        >
          <IonDatetime
            onIonChange={(e) => onIonChangeHandler(e.detail.value || "")}
            value={date}
            size={"cover"}
            showDefaultButtons={true}
            preferWheel={true}
            presentation="date"
          />
        </IonModal>
        <div className="flex justify-center mt-8">
          <OutlinedIconButton
            onClick={() =>
              presentAlert({
                header: "Teilnehmer wirklich entfernen?",
                buttons: [
                  {
                    text: "Abbrechen",
                    handler: () => {},
                  },
                  {
                    text: "Bestätigen",
                    handler: () => {
                      onSubmit(null, null, "delete");
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
      </IonContent>
    </IonPage>
  );
};

export default EditParticipantModal;
