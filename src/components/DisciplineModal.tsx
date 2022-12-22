import { IonButton, IonContent } from "@ionic/react";
import { useEffect, useState } from "react";
import { getQuestions, getSubgroupQuestions } from "../db/queryDb";
import { Question } from "../entity/Question";
import { QuestionGroup } from "../entity/QuestionGroup";
import { QuestionSubgroup } from "../entity/QuestionSubgroup";

interface ModalProps {
  questionGroup: QuestionGroup;
}

const SubgroupModal: React.FC<ModalProps> = ({}) => {
  // inside this modal I need to show the subgroup questions. Therefore, I need to fetch them first
  return (
    <IonContent>
      <p>Welcome to the subgroup Modal!</p>
    </IonContent>
  );
};

const DisciplineModal: React.FC<ModalProps> = ({ questionGroup }) => {
  // every question group with name == subgroup name, needs to list the subgroup questions here
  // therefore, we need to fetch them here
  const [subgroupQuestions, setSubgroupQuestions] = useState<
    QuestionSubgroup[]
  >([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const getSubgroups = async () => {
    let result = await getSubgroupQuestions(questionGroup);
    result = result.slice(0, result.length / 2);
    setSubgroupQuestions(result);
  };

  const getQuestionsSubgroup = async () => {
    for (let i = 0; i < subgroupQuestions.length; i++) {
      let result = await getQuestions(subgroupQuestions[i]);
      console.log("result: ", result);
      setQuestions(result);
    }
  };

  useEffect(() => {
    getSubgroups();
  }, []);
  useEffect(() => {
    getQuestionsSubgroup();
  }, [subgroupQuestions]);

  return (
    <IonContent>
      <p>Welcome to the Modal!!</p>
      <p>{questionGroup.name}</p>
      {subgroupQuestions.map((subgroupQuestion, index) => (
        <p>{subgroupQuestion.name}</p>
      ))}
      {questions.map((question, index) => (
        <p>{question.question}</p>
      ))}
    </IonContent>
  );
};

export default DisciplineModal;
