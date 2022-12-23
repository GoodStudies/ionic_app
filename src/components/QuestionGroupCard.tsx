import {
  IonButton,
  IonCard,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonToast,
  useIonModal,
} from "@ionic/react";
import { useState } from "react";
import { QuestionGroup } from "../entity/QuestionGroup";
import DisciplineModal from "./DisciplineModal";

interface CardItemProps {
  questionGroup: QuestionGroup;
}

interface CardProps {
  questionGroupList: QuestionGroup[];
}

const QuestionGroupCardItem: React.FC<CardItemProps> = ({ questionGroup }) => {
  const [toast, setToast] = useState(false);
  const [present, dismiss] = useIonModal(DisciplineModal, {
    dismiss: () => onDismiss(),
    questionGroup: questionGroup,
  });

  const modalOptions = {
    onDidDismiss: () => dismiss(),
  };

  const onDismiss = () => {
	dismiss();
	setToast(true);
  }

  // here we need to implement the function, which checks whether all questions are answered
  return (
	<div>
    <IonItem class="item-card">
      <IonCheckbox slot="start" disabled={true}></IonCheckbox>
      <IonLabel>{questionGroup.name}</IonLabel>
      <IonButton onClick={() => present(modalOptions)}>Open Modal</IonButton>
    </IonItem>
	<IonToast
          cssClass={"custom-toast"}
          isOpen={toast}
          onDidDismiss={() => setToast(false)}
          message="Teilnehmer wurde erfolgreich gespeichert"
          duration={2000}
        />
	</div>
  );
};

const QuestionGroupCard: React.FC<CardProps> = ({ questionGroupList }) => {
  return (
    <IonCard class="item-card">
      {questionGroupList.map((questionGroup, index) => (
        <QuestionGroupCardItem key={index} questionGroup={questionGroup} />
      ))}
    </IonCard>
  );
};

export default QuestionGroupCard;
