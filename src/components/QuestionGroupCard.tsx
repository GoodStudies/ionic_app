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
import SpecialModal from "./SpecialModal";

interface CardItemProps {
  questionGroup: QuestionGroup;
}

interface CardProps {
  questionGroupList: QuestionGroup[];
}

const QuestionGroupCardItem: React.FC<CardItemProps> = ({ questionGroup }) => {
  const [toast, setToast] = useState(false);
  const [checkmark, setCheckmark] = useState(false);
  // change the name of this state to something more fitting (i.e update)
  const [test, setTest] = useState(false);
  const [subgroups, setSubgroups] = useState<QuestionSubgroup[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [present, dismiss] = useIonModal(DisciplineModal, {
    dismiss: (test: boolean) => onDismiss(test),
    questionGroup: questionGroup,
  });
  const [presentSpecial, dismissSpecial] = useIonModal(SpecialModal, {
    dismissSpecial: (test: boolean) => onDismissSpecial(test),
    questionGroup: questionGroup,
  });
  const { selectedParticipant, setSelectedParticipant } = useParticipant();

  const modalOptions = {
    onDidDismiss: () => dismiss(),
  };

  const specialModalOptions = {
    onDidDismiss: () => dismissSpecial(),
  };

  const onDismiss = (test: boolean) => {
    setTest(test);
    dismiss();
    setToast(true);
  };

  const onDismissSpecial = (test: boolean) => {
    setTest(test);
    dismissSpecial();
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
    let answers = await getSubgroupAnswers(
      participant,
      questions,
      subgroups[0]
    );
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

  // if subgroup.length > 1
  const checkSubgroupAnswers = async () => {
    let check: number = 0;
    let length: number = 0;
    for (let i = 0; i < subgroups.length; i++) {
      let answers = await getSubgroupAnswers(
        selectedParticipant,
        questions,
        subgroups[i]
      );
      for (let j = 0; j < answers.length; j++) {
        if (answers[j] != "keine Angabe") {
          check++;
        }
        length++;
      }
    }
    if (length == check) {
      setCheckmark(true);
    } else {
      setCheckmark(false);
    }
  };

  const updateAnswers = async () => {
    await defineAnswers(selectedParticipant);
    if (subgroups.length > 1) {
      checkSubgroupAnswers();
    } else {
      checkAnswers(answers);
    }
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
    if (subgroups.length > 1) {
      checkSubgroupAnswers();
    } else {
      checkAnswers(answers);
    }
  }, [answers]);
  useEffect(() => {
    updateAnswers();
    setTest(false);
  }, [test]);

  return (
    <div>
      <IonItem class="item-card">
        <IonLabel
          onClick={() =>
            questionGroup.name == "Monopedales Hüpfen"
              ? presentSpecial(specialModalOptions)
              : present(modalOptions)
          }
          className="text-center"
        >
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
