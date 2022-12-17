import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import useOrientation from "../hooks/useOrientation";
import { AppDataSource, fixedQuestions, participantList } from "../App";
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
import { Answer } from "../entity/Answer";
import { Question } from "../entity/Question";
import { Participant } from "../entity/Participant";
import { QuestionMultipleChoice } from "../entity/QuestionMultipleChoice";

const ParticipantModal = ({
  onDismiss,
}: {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | string[] | null>("Auswaehlen");
  const { isPortrait } = useOrientation();
  const { register, handleSubmit } = useForm();

  const closeModal = () => {
    setOpen(false);
  };

  const onIonChangeHandler = (value: string | string[] | null) => {
    let formattedDate = format(parseISO(value as string), "dd.MM.yyyy");
    setValue(formattedDate);
  };

  const onSubmit = async (data: any) => {
    let answer;
    console.log(data);
    console.log(value);
    // here I need to create the participant + answers
    const participant = AppDataSource.manager.create(Participant, {
      firstname: data["Vorname"],
      lastname: data["Nachname"],
      birthdate: value?.toString(),
    });
    await AppDataSource.manager.save(participant);
    console.log("successfully created participant!");
    console.log("check whether the participant really was created...");
    const participants = await AppDataSource.manager.find(Participant, {
      where: {
        firstname: data["Vorname"],
      },
    });
    console.log(
      "the found participants lastname is: " +
        participants[participants.length - 1].lastname
    );
    console.log(
      "the found participants birthdate is: " +
        participants[participants.length - 1].birthdate
    );
    console.log(
      "the found participants id is: " +
        participants[participants.length - 1].local_id
    );
    // create the answers here:
    for (let i = 0; i < fixedQuestions.length; i++) {
      if (fixedQuestions[i].question_name === "Geburtsdatum") {
        answer = AppDataSource.manager.create(Answer, {
          value: value?.toString(),
          participant: participant,
        });
      } else {
        answer = AppDataSource.manager.create(Answer, {
          value: data[fixedQuestions[i].question_name],
          participant: participant,
        });
      }
      let question = await AppDataSource.manager.findOne(Question, {
        where: {
          question: fixedQuestions[i].question_name,
        },
      });
      console.log(
        `answer for ${question?.question} was succcessfully created!`
      );
      answer.question = question!;
      await AppDataSource.manager.save(answer);
      console.log(`answer for ${question?.question} was succcessfully saved!`);
    }
    console.log("check whether answers got saved...");
    const answers = await AppDataSource.manager.find(Answer, {
      where: {
        participant: participant,
      },
    });
    console.log("the answers are: ");
    for (let i = 0; i < answers.length; i++) {
      console.log("the answer is: " + answers[i].value);
    }
    // add participant to the participantList
    participantList.push(participant);
    // closes the modal
    onDismiss(null, "confirm");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => onDismiss(null, "cancel")}>
              Abbruch
            </IonButton>
          </IonButtons>
          <IonTitle>huhu</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={handleSubmit((data) => {
                onSubmit(data);
              })}
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
                <IonLabel position="stacked">{question.question_name}</IonLabel>
                <IonSelect
                  {...register(question.question_name)}
                  interface="popover"
                  placeholder={"keine Angabe"}
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
              <IonLabel position="stacked">{question.question_name}</IonLabel>
              {question.question_name == "Geburtsdatum" ? (
                <>
                  <button className="date-picker" onClick={() => setOpen(true)}>
                    {value}
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
            value={value}
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
