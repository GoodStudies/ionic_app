import {
  IonCol,
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { getQuestions, getSubgroups } from "../db/queryDb";
import { Question } from "../entity/Question";
import { QuestionGroup } from "../entity/QuestionGroup";
import { QuestionSubgroup } from "../entity/QuestionSubgroup";
import OutlinedIconButton from "./OutlinedIconButton";
import { save } from "ionicons/icons";
import { useForm } from "react-hook-form";
import { createSpecialDisciplineAnswers } from "../db/createDisciplineAnswer";
import { useParticipant } from "./ParticipantContext";
import { Participant } from "../entity/Participant";
import { AppDataSource } from "../App";
import { Answer } from "../entity/Answer";

interface ModalProps {
  questionGroup: QuestionGroup;
  dismissSpecial: (test: boolean) => void;
}

const SpecialModal: React.FC<ModalProps> = ({
  questionGroup,
  dismissSpecial,
}) => {
  // every question group with name == subgroup name, needs to list the subgroup questions here
  // therefore, we need to fetch them here
  const [subgroups, setSubgroups] = useState<QuestionSubgroup[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>();
  const [subgroupQuestions, setSubgroupQuestions] = useState<Question[]>([]);
  // can be deleted later on
  const [description, setDescription] = useState<string>("");
  const [firstSubgroupAnswer, setFirstAnswer] = useState<string>();
  const [secondSubgroupAnswer, setSecondAnswer] = useState<string>();
  const { register, handleSubmit } = useForm();
  const { selectedParticipant, setSelectedParticipant } = useParticipant();

  const defineSubgroups = async () => {
    let result = await getSubgroups(questionGroup);
    setSubgroups(result);
  };

  // we need two question arrays here
  const getSubgroupQuestions = async (subgroups: QuestionSubgroup[]) => {
    for (let i = 0; i < subgroups.length; i++) {
      let result = await getQuestions(subgroups[i]);
      // can be deleted later on
      setDescription(result[0].description);
      if (i == 0) {
        setSubgroupQuestions(result);
      }
      setSelectedQuestion(result[0]);
    }
  };

  // we have to answers, one for each subgroup
  const defineAnswers = async (
    subgroups: QuestionSubgroup[],
    selectedQuestion: Question,
    participant: Participant
  ) => {
    for (let i = 0; i < subgroups.length; i++) {
      let question = await AppDataSource.manager.find(Question, {
        where: {
          // pick the right question first
          question: selectedQuestion.question,
          questionSubgroup: subgroups[i],
        },
      });
      let answer = await AppDataSource.manager.find(Answer, {
        where: {
          question: question[question.length - 1],
          participant: participant,
        },
      });
      if (
        answer.length >= 1 &&
        answer[answer.length - 1] != undefined &&
        answer[answer.length - 1].value != ""
      ) {
        if (i == 0) {
          setFirstAnswer(answer[answer.length - 1].value);
        } else {
          setSecondAnswer(answer[answer.length - 1].value);
        }
      } else {
        if (i == 0) {
          setFirstAnswer("keine Angabe");
        } else {
          setSecondAnswer("keine Angabe");
        }
      }
    }
  };

  const changeQuestion = async (questionName: string) => {
    let question = await AppDataSource.manager.find(Question, {
      where: {
        question: questionName,
      },
    });
    setSelectedQuestion(question[question.length - 1]);
  };

  const onSubmit = async (
    data: any,
    selectedParticipant: Participant,
    selectedQuestion: Question,
    subgroups: QuestionSubgroup[]
  ) => {
    // very important to wait here, in order to update the QuestionGroupCard!
    await createSpecialDisciplineAnswers(
      data,
      selectedParticipant,
      selectedQuestion,
      subgroups
    );
    dismissSpecial(true);
  };

  useEffect(() => {
    defineSubgroups();
  }, []);
  useEffect(() => {
    getSubgroupQuestions(subgroups);
  }, [subgroups]);
  useEffect(() => {
    defineAnswers(subgroups, selectedQuestion!, selectedParticipant);
  }, [selectedQuestion, selectedParticipant, subgroups]);

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
      {subgroupQuestions.length > 1 ? (
        <div className="flex justify-center">
          <IonList>
            <IonItem lines="none">
              <IonSelect
                {...register("subgroup")}
                interface="popover"
                placeholder={subgroupQuestions[0].question}
                onIonChange={(e) => changeQuestion(e.detail.value)}
              >
                {subgroupQuestions.map((choice: Question, index: number) => (
                  <IonSelectOption
                    key={index}
                    value={choice.question}
                    className="text-sm"
                  >
                    {choice.question}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonList>
        </div>
      ) : null}
      <div className="h-3/4 grid content-around justify-center">
        {subgroups.map((subgroup, index) => (
          <div className="flex justify-between">
            <IonCol key={index}>
              <IonItem lines={"none"}>
                <p>{subgroup.name}</p>
              </IonItem>
            </IonCol>
            <IonCol>
              <div className="border-2 rounded-lg pl-2 border-blue-500">
                <IonInput
                  placeholder={
                    index == 0 ? firstSubgroupAnswer : secondSubgroupAnswer
                  }
                  {...register(subgroup.name)}
                ></IonInput>
              </div>
            </IonCol>
          </div>
        ))}
      </div>
      <div className="flex justify-center pt-6">
        <OutlinedIconButton
          onClick={handleSubmit((data) =>
            onSubmit(data, selectedParticipant, selectedQuestion!, subgroups)
          )}
          label={"Speichern"}
          icon={save}
          style={"custom-button"}
        />
      </div>
    </IonContent>
  );
};

export default SpecialModal;
