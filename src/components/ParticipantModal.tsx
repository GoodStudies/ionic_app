import { useEffect, useState } from "react";
import { FieldValues, useForm, UseFormRegister } from "react-hook-form";
import { format, parseISO } from "date-fns";
import useOrientation from "../hooks/useOrientation";
import { AppDataSource, fixedQuestions } from "../App";
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
import { Question } from "../entity/Question";

interface Props {
  question: Question;
  index: number;
  register: UseFormRegister<FieldValues>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formattedDate: string | string[] | null;
}

const FixedQuestions: React.FC<Props> = ({
  question,
  index,
  register,
  setOpen,
  formattedDate,
}) => {
  const [mp, setMp] = useState<QuestionMultipleChoice[]>([]);

  useEffect(() => {
    async function checkMpQuestions(question: Question) {
      const result = await AppDataSource.manager.find(QuestionMultipleChoice, {
        where: {
          question: question,
        },
      });
      if (result.length > 0) {
        setMp(result);
      } else {
        setMp([]);
      }
    }
    checkMpQuestions(question);
  }, []);

  return (
    <>
      {mp.length > 0 ? (
        <>
          <IonList key={index}>
            <IonItem key={index}>
              <IonLabel position="stacked">{question.question}</IonLabel>
              <IonSelect
                {...register(question.question)}
                interface="popover"
                placeholder={"keine Angabe"}
              >
                {mp.map((choice: QuestionMultipleChoice, index: number) => (
                  <IonSelectOption key={index} value={choice.value}>
                    {choice.value}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonList>
        </>
      ) : (
        <>
          <IonItem key={index}>
            <IonLabel position="stacked">{question.question}</IonLabel>
            {question.question == "Geburtsdatum" ? (
              <>
                <button className="date-picker" onClick={() => setOpen(true)}>
                  {formattedDate}
                </button>
              </>
            ) : (
              <IonInput
                {...register(question.question)}
                placeholder={question.question}
              />
            )}
          </IonItem>
        </>
      )}
    </>
  );
};

const ParticipantModal = ({
  onDismiss,
}: {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  const [date, setDate] = useState<any>();
  const [formattedDate, setFormattedDate] = useState<string | string[] | null>(
    "Auswaehlen"
  );
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
                onSubmit(data, formattedDate?.toString()
				);
              })}
            >
              Speichern
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {fixedQuestions.map((question, index) => (
          <FixedQuestions
            question={question}
            index={index}
            register={register}
            setOpen={setOpen}
            formattedDate={formattedDate}
          ></FixedQuestions>
        ))}
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
