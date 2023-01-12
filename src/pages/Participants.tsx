import { IonGrid, IonList, IonToast, useIonModal, useIonRouter } from "@ionic/react";
import PageLayout from "../components/PageLayout";
import { addCircleOutline } from "ionicons/icons";
import OutlinedIconButton from "../components/OutlinedIconButton";
import ParticipantList from "../components/ParticipantList/ParticipantList";
import ParticipantListItem from "../components/ParticipantList/ParticipantListItem";
import {
  TableColumns,
  columnNames,
} from "../components/ParticipantList/TableColumns";
import { useEffect, useState } from "react";
import ParticipantModal from "../components/Modals/ParticipantModal";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useParticipantList } from "../context/ParticipantListContext";
import { History } from "history";

const ParticipantsTable: React.FC = () => {
  const { newParticipantList } = useParticipantList();

  useEffect(() => {
  }, [newParticipantList]);

  return (
    <>
      <IonGrid>
        <TableColumns columnNames={columnNames} />
        <IonList className="participantList">
          <ParticipantList
            items={newParticipantList}
            component={ParticipantListItem}
          />
        </IonList>
      </IonGrid>
    </>
  );
};

interface Props {
	history: History;
}

const Participants: React.FC<Props> = ({history}) => {
  const [present, dismiss] = useIonModal(ParticipantModal, {
    onDismiss: (data: string, role: string) => dismiss(data, role),
  });
  const [showToast, setShowToast] = useState(false);
  const router = useIonRouter();

  function openModal() {
    present({
      onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
        if (ev.detail.role === "confirm") {
          setShowToast(true);
        }
      },
    });
  }

  // replaces routing history. prevents the user from going back to the login screen
  useEffect(() => {
	history.replace("");
  }, []);

  document.addEventListener("ionBackButton", (ev: any) => {
	ev.detail.register(10, () => {
	  if (router.canGoBack()) {
		router.goBack();
	}
	});
  })

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
