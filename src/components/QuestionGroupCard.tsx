import {
  IonCard,
  IonItem,
  IonLabel,
  IonToast,
  useIonModal,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getQuestions, getSubgroupAnswers, getSubgroups } from "../db/queryDb";
import { Participant } from "../entity/Participant";
import { Question } from "../entity/Question";
import { QuestionGroup } from "../entity/QuestionGroup";
import { QuestionSubgroup } from "../entity/QuestionSubgroup";
import DisciplineModal from "./DisciplineModal";
import { useParticipant } from "./ParticipantContext";

interface CardItemProps {
  questionGroup: QuestionGroup;
}

interface CardProps {
  questionGroupList: QuestionGroup[];
}

const QuestionGroupCardItem: React.FC<CardItemProps> = ({ questionGroup }) => {
  const [toast, setToast] = useState(false);
  const [checkmark, setCheckmark] = useState(false);
  const [test, setTest] = useState(false);
  const [subgroups, setSubgroups] = useState<QuestionSubgroup[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [present, dismiss] = useIonModal(DisciplineModal, {
    dismiss: (test: boolean) => onDismiss(test),
    questionGroup: questionGroup,
  });
  const { selectedParticipant, setSelectedParticipant } = useParticipant();

  const modalOptions = {
    onDidDismiss: () => dismiss(),
  };

  const onDismiss = (test: boolean) => {
    setTest(test);
    dismiss();
    setToast(true);
  };

  const defineSubgroups = async () => {
    let result = await getSubgroups(questionGroup);
    setSubgroups(result);
  };

  const getsubgroups = async () => {
    for (let i = 0; i < subgroups.length; i++) {
      let result = await getQuestions(subgroups[i]);
      setQuestions(result);
    }
  };

  const defineAnswers = async (participant: Participant) => {
    let answers = await getSubgroupAnswers(participant, questions, subgroups);
    setAnswers(answers);
  };

  const checkAnswers = (answers: string[]) => {
    let check: number = 0;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] != "keine Angabe") {
        check++;
      }
    }
    if (check == answers.length) {
      setCheckmark(true);
    } else {
      setCheckmark(false);
    }
  };

  const updateAnswers = async () => {
    await defineAnswers(selectedParticipant);
    checkAnswers(answers);
  };

  // I am embarassed by this section
  useEffect(() => {
    defineSubgroups();
  }, [selectedParticipant]);
  useEffect(() => {
    getsubgroups();
  }, [subgroups]);
  useEffect(() => {
    defineAnswers(selectedParticipant);
  }, [questions]);
  useEffect(() => {
    checkAnswers(answers);
  }, [answers]);
  useEffect(() => {
    updateAnswers();
    setTest(false);
  }, [test]);

  return (
    <div>
      <IonItem class="item-card">
        <IonLabel onClick={() => present(modalOptions)} className="text-center">
          {checkmark == true ? (
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
