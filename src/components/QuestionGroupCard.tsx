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
  const [data, setData] = useState(false);
  const [present, dismiss] = useIonModal(DisciplineModal, {
    dismiss: (data: boolean) => onDismiss(data),
    questionGroup: questionGroup,
  });

  const modalOptions = {
    onDidDismiss: () => dismiss(),
  };

  const onDismiss = (data: boolean) => {
    // if all questions of group are answered
    setData(data);
    dismiss();
    setToast(true);
  };

  // here we need to implement the function, which checks whether all questions are answered
  return (
    <div>
      <IonItem class="item-card">
        <IonLabel onClick={() => present(modalOptions)} className="text-center">
          {data == true ? (
            <span>{questionGroup.name} ✅</span>
          ) : (
            questionGroup.name
          )}
        </IonLabel>
      </IonItem>
      <IonToast
        cssClass={"custom-toast"}
        isOpen={toast}
        onDidDismiss={() => setToast(false)}
        message="Ergebnisse wurden erfolgreich gespeichert"
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
