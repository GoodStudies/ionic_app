import {
  IonCol,
  IonContent,
  IonInput,
  IonItem,
  IonRow,
  IonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getQuestions, getSubgroupQuestions } from "../db/queryDb";
import { Question } from "../entity/Question";
import { QuestionGroup } from "../entity/QuestionGroup";
import { QuestionSubgroup } from "../entity/QuestionSubgroup";
import OutlinedIconButton from "./OutlinedIconButton";
import { save } from "ionicons/icons";
import { useForm } from "react-hook-form";
import { createDisciplineAnswers, getDisciplineAnswers } from "../db/createDisciplineAnswer";
import { useParticipant } from "./ParticipantContext";
import { Participant } from "../entity/Participant";

interface ModalProps {
  questionGroup: QuestionGroup;
  dismiss: () => void;
}

const SubgroupModal: React.FC<ModalProps> = ({}) => {
  // inside this modal I need to show the subgroup questions. Therefore, I need to fetch them first
  return (
    <IonContent>
      <p>Welcome to the subgroup Modal!</p>
    </IonContent>
  );
};

const DisciplineModal: React.FC<ModalProps> = ({ questionGroup, dismiss }) => {
  // every question group with name == subgroup name, needs to list the subgroup questions here
  // therefore, we need to fetch them here
  const [subgroupQuestions, setSubgroupQuestions] = useState<
    QuestionSubgroup[]
  >([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [description, setDescription] = useState<string>("");
//   const [toast, setToast] = useState(false);
  const { register, handleSubmit } = useForm();
  const { selectedParticipant, setSelectedParticipant } = useParticipant();

  const getSubgroups = async () => {
    let result = await getSubgroupQuestions(questionGroup);
    result = result.slice(0, result.length / 2);
    setSubgroupQuestions(result);
  };

  const getQuestionsSubgroup = async () => {
    for (let i = 0; i < subgroupQuestions.length; i++) {
      let result = await getQuestions(subgroupQuestions[i]);
      setDescription(result[0].description);
      setQuestions(result);
    }
  };

  const onSubmit = (data: any,  selectedParticipant: Participant, questions: Question[]) => {
	createDisciplineAnswers(data, selectedParticipant, questions);
	dismiss();
  }

  useEffect(() => {
    getSubgroups();
  }, []);
  useEffect(() => {
    getQuestionsSubgroup();
  }, [subgroupQuestions]);

  return (
    <IonContent class="ion-padding">
      <h3 className="flex justify-center font-bold text-xl">
        {questionGroup.name}
      </h3>
      <p className="flex justify-center text-blue-600">{description}</p>
      {subgroupQuestions.map((subgroupQuestion, index) => (
        <p>
          {subgroupQuestion.name == questionGroup.name
            ? null
            : subgroupQuestion.name}
        </p>
      ))}
      <div className="h-3/4 grid content-around">
        {questions.map((question, index) => (
          <div className="flex justify-around">
            <IonRow>
              <IonCol>
                <IonItem key={index} lines={"none"}>
                  <p>{question.question}</p>
                </IonItem>
              </IonCol>
              <IonCol>
                <div className="border-2 rounded-lg pl-2 border-blue-500">
                  <IonInput {...register(question.question)}></IonInput>
                </div>
              </IonCol>
            </IonRow>
          </div>
        ))}
      </div>
      <div className="flex justify-center pt-6">
        <OutlinedIconButton
          onClick={handleSubmit((data) => onSubmit(data, selectedParticipant, questions))}
          label={"Speichern"}
          icon={save}
          style={"custom-button"}
        />
      </div>
    </IonContent>
  );
};

export default DisciplineModal;
