import { IonContent } from "@ionic/react";
import { useEffect } from "react";
import { useParticipantList } from "../../context/ParticipantListContext";

interface ParticipantListProps {
  items: any[];
  component: any;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
  items: participantsList,
  component: Component,
}) => {
//   const { newParticipantList } = useParticipantList();

//   useEffect(() => {
//   }, [newParticipantList]);

  return (
    <IonContent>
      {participantsList.map((participant, i) => (
        <Component key={i} {...{ participant }} />
      ))}
    </IonContent>
  );
};

export default ParticipantList;
