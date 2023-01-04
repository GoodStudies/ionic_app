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
import {
  createDisciplineAnswers,
  getDisciplineAnswers,
} from "../db/createDisciplineAnswer";
import { useParticipant } from "./ParticipantContext";
import { Participant } from "../entity/Participant";
import { Answer } from "../entity/Answer";
import { AppDataSource } from "../App";

interface ModalProps {
  questionGroup: QuestionGroup;
  dismiss: (data: boolean) => void;
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
  const [answers, setAnswers] = useState<string[]>([]);
  //   const [toast, setToast] = useState(false);
  const { register, handleSubmit } = useForm();
  const { selectedParticipant, setSelectedParticipant } = useParticipant();

  const getSubgroups = async () => {
    let result = await getSubgroupQuestions(questionGroup);
    console.log("subgroupQuestions: ", result);
    setSubgroupQuestions(result);
  };

  const getQuestionsSubgroup = async () => {
    for (let i = 0; i < subgroupQuestions.length; i++) {
      let result = await getQuestions(subgroupQuestions[i]);
      setDescription(result[0].description);
      setQuestions(result);
    }
  };

  const onSubmit = (
    data: any,
    selectedParticipant: Participant,
    questions: Question[]
  ) => {
    createDisciplineAnswers(data, selectedParticipant, questions);
    dismiss(checkAnswers(answers));
  };

  // get answers for questions with only one subgroup
  const getAnswers = async (participant: Participant) => {
    let new_answers: string[] = [];
    for (let i = 0; i < questions.length; i++) {
      const question = await AppDataSource.manager.find(Question, {
        where: {
          question: questions[i].question,
          questionSubgroup: subgroupQuestions[0],
        },
      });
      console.log("the question is: ", question);
      const answer = await AppDataSource.manager.find(Answer, {
        where: {
          participant: participant,
          question: question[0],
        },
      });
      // if answer was not provided yet
      // we check out the last provided answer
      if (
        answer[answer.length - 1] != undefined &&
        answer[answer.length - 1].value != ""
      ) {
        new_answers.push(answer[answer.length - 1].value);
      } else {
        new_answers.push("keine Angabe");
      }
    }
    console.log("new answers: ", new_answers);
    setAnswers(new_answers);
  };

  const checkAnswers = (answers: string[]) => {
    let check: number = 0;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] != "keine Angabe") {
        check++;
      }
    }
    if (check == answers.length) {
      console.log("check is:", check);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    getSubgroups();
  }, []);
  useEffect(() => {
    getQuestionsSubgroup();
  }, [subgroupQuestions]);
  useEffect(() => {
    getAnswers(selectedParticipant);
  }, [questions]);

  return (
    <IonContent class="ion-padding">
      <h3 className="flex justify-center font-bold text-xl">
        {questionGroup.name}
      </h3>
      {description ? (
        <p className="flex justify-center text-blue-600">{description}</p>
      ) : (
        <p className="text-transparent">null</p>
      )}
      {subgroupQuestions.map((subgroupQuestion, index) => (
        <p>
          {subgroupQuestion.name == questionGroup.name
            ? null
            : subgroupQuestion.name}
        </p>
      ))}
      <div className="h-3/4 grid content-around justify-center">
        {questions.map((question, index) => (
          <div className="flex justify-between">
            <IonCol key={index}>
              <IonItem lines={"none"}>
                <p>{question.question}</p>
              </IonItem>
            </IonCol>
            <IonCol>
              <div className="border-2 rounded-lg pl-2 border-blue-500">
                <IonInput
                  placeholder={answers[index]}
                  {...register(question.question)}
                ></IonInput>
              </div>
            </IonCol>
          </div>
        ))}
      </div>
      <div className="flex justify-center pt-6">
        <OutlinedIconButton
          onClick={handleSubmit((data) =>
            onSubmit(data, selectedParticipant, questions)
          )}
          label={"Speichern"}
          icon={save}
          style={"custom-button"}
        />
      </div>
    </IonContent>
  );
};

export default DisciplineModal;
