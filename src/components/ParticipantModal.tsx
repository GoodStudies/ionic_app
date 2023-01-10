import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import useOrientation from "../hooks/useOrientation";
import { fixedQuestions } from "../App";
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
} from "@ionic/react";
import { QuestionMultipleChoice } from "../entity/QuestionMultipleChoice";
import { createParticipant } from "../db/createParticipant";

const ParticipantModal = ({
  onDismiss,
}: {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  const [date, setDate] = useState<any>();
  const [formattedDate, setFormattedDate] = useState<string | string[] | null>("Auswaehlen");
  const [open, setOpen] = useState(false);
  const { isPortrait } = useOrientation();
  const { register, handleSubmit } = useForm();

  const closeModal = () => {
    setOpen(false);
  };

  const onIonChangeHandler = (value: string | string[] | null) => {
    setDate(value);
    let formattedDate = format(parseISO(value as string), "dd.MM.yyyy");
    setFormattedDate(formattedDate);
  };

  const onSubmit = async (data: any, birthdate: string | undefined) => {
    createParticipant(data, birthdate);
    onDismiss(null, "confirm");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar mode="ios">
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => onDismiss(null, "cancel")}>
              Abbruch
            </IonButton>
          </IonButtons>
          <IonTitle>Teilnehmer erstellen</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={handleSubmit((data) => {
                onSubmit(data, formattedDate?.toString());
              })}
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
                  placeholder={"keine Angabe"}
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
                  <button className="date-picker" onClick={() => setOpen(true)}>
                    {formattedDate}
                  </button>
                </>
              ) : (
                <IonInput
                  {...register(question.question_name)}
                  placeholder={question.question_name}
                />
              )}
            </IonItem>
          )
        )}
        <IonModal
          isOpen={open}
          onDidDismiss={closeModal}
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
      </IonContent>
    </IonPage>
  );
};

export default ParticipantModal;
