import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { trash } from "ionicons/icons";
import { useForm } from "react-hook-form";
import { updateParticipant } from "../../db/participantQuerries";
import { Participant } from "../../entity/Participant";
import OutlinedIconButton from "../OutlinedIconButton";
import { useParticipantList } from "../../context/ParticipantListContext";
import useOrientation from "../../hooks/useOrientation";
import { deleteParticipant } from "../../db/participantQuerries";
import { getAnswers } from "../../db/get";
import FixedQuestions from "../FixedQuestionList";

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
  const { setParticipantList, newParticipantList } = useParticipantList();

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
      deleteParticipant(participant, newParticipantList, setParticipantList).then(() => {
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
        {fixedQuestions.map((question, index) => (
          <FixedQuestions
            question={question}
            index={index}
            register={register}
            setOpen={setOpenDate}
            formattedDate={formattedDate}
            answers={answers}
          />
        ))}
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
