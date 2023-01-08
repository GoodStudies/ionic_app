import { IonButton, IonGrid, IonList, IonToast, useIonModal } from "@ionic/react";
import PageLayout from "../components/PageLayout";
import { addCircleOutline } from "ionicons/icons";
import OutlinedIconButton from "../components/OutlinedIconButton";
import ParticipantList from "../components/ParticipantList/ParticipantList";
import ParticipantListItem from "../components/ParticipantList/ParticipantListItem";
import {
  TableColumns,
  columnNames,
} from "../components/ParticipantList/TableColumns";
import { useState } from "react";
import ParticipantModal from "../components/ParticipantModal";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { participantList } from "../App";

const ParticipantsTable: React.FC = () => {
  return (
    <>
      <IonGrid>
        <TableColumns columnNames={columnNames} />
        <IonList className="participantList">
          <ParticipantList
            items={participantList}
            component={ParticipantListItem}
          />
        </IonList>
      </IonGrid>
    </>
  );
};

const Participants: React.FC = () => {
  const [present, dismiss] = useIonModal(ParticipantModal, {
    onDismiss: (data: string, role: string) => dismiss(data, role),
  });
  const [showToast, setShowToast] = useState(false);

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === "confirm") {
          setShowToast(true);
        }
      },
    });
  }

  return (
    <>
      <PageLayout title="Teilnehmer Liste" content={ParticipantsTable}>
        <div className="flex justify-center pt-20">
          <OutlinedIconButton
            style={"custom-button"}
            onClick={openModal}
            label={"Teilnehmer hinzufuegen"}
            icon={addCircleOutline}
          />
        </div>
        <IonToast
          cssClass={"custom-toast"}
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Teilnehmer wurde erfolgreich gespeichert"
          duration={2000}
        />
      </PageLayout>
    </>
  );
};

export default Participants;
