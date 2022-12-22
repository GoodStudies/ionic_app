import {
  IonButton,
  IonCard,
  IonCheckbox,
  IonItem,
  IonLabel,
  useIonModal,
} from "@ionic/react";
import { QuestionGroup } from "../entity/QuestionGroup";
import DisciplineModal from "./DisciplineModal";

interface CardItemProps {
  questionGroup: QuestionGroup;
}

interface CardProps {
  questionGroupList: QuestionGroup[];
}

const QuestionGroupCardItem: React.FC<CardItemProps> = ({ questionGroup }) => {
  const [present, dismiss] = useIonModal(DisciplineModal, {
    dismiss: () => dismiss(),
    questionGroup: questionGroup,
  });

  const modalOptions = {
    onDidDismiss: () => dismiss(),
  };

  // here we need to implement the function, which checks whether all questions are answered
  return (
    <IonItem class="item-card">
      <IonCheckbox slot="start" disabled={true}></IonCheckbox>
      <IonLabel>{questionGroup.name}</IonLabel>
      <IonButton onClick={() => present(modalOptions)}>Open Modal</IonButton>
    </IonItem>
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
