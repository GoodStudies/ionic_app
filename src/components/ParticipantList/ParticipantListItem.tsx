import { useEffect, useState } from "react";
import { bicycle, personAdd } from "ionicons/icons";
import { Participant } from "../../entity/Participant";
import { fixedQuestions } from "../../App";
import {
  IonCard,
  IonCol,
  IonIcon,
  IonRow,
  IonToast,
  useIonModal,
  useIonRouter,
} from "@ionic/react";
import { useParticipant } from "../ParticipantContext";
import { checkAllAnswers } from "../../db/queryDb";
import EditParticipantModal from "./EditParticipantModal";

interface ParticipantListItemProps {
  participant: Participant;
}

const ParticipantListItem: React.FC<ParticipantListItemProps> = ({
  participant,
}) => {
  const [, setParticipant] = useState<Participant>(participant);
  const [showToast, setShowToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [checkmark, setCheckmark] = useState<boolean>(false);
  const { setSelectedParticipant } = useParticipant();
  const navigation = useIonRouter();
  const [present, dismiss] = useIonModal(EditParticipantModal, {
    participant: participant,
    fixedQuestions: fixedQuestions,
    dismiss: (mode: string) => onDismiss(mode),
  });

  const onDismiss = (mode: string) => {
    if (mode == "save") {
      // should update the participants card UI (?)
      setParticipant(participant);
      dismiss();
      setShowToast(true);
    } else if (mode == "delete") {
      dismiss();
      setShowDeleteToast(true);
    } else {
      dismiss();
    }
  };

  const modalOptions = {
    onDidDismiss: () => dismiss(),
  };

  const changePage = () => {
    setSelectedParticipant(participant);
    navigation.push("/questionGroups", "forward");
  };

  useEffect(() => {
    checkAllAnswers(participant).then((result) => {
      setCheckmark(result);
    });
  }, [navigation]);

  // need to call setAnswers(await getAnswers(participant, fixedQuestions)) together with present()

  return (
    <IonCard
      className={checkmark ? "p-1 m-4 border-2 border-green-400" : "p-1 m-4"}
    >
      <IonRow>
        <IonCol>{participant.firstname}</IonCol>
        <IonCol>{participant.lastname}</IonCol>
        <IonCol>{participant.birthdate}</IonCol>
        <IonCol
          className="italic text-[#2A6BF2]"
          push="2"
          onClick={() => present(modalOptions)}
        >
          bearbeiten
          <IonIcon icon={personAdd}></IonIcon>
        </IonCol>
        <IonCol className="italic text-[#2A6BF2]" push="1" onClick={changePage}>
          aufnehmen
          <IonIcon icon={bicycle}></IonIcon>
        </IonCol>
      </IonRow>
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
