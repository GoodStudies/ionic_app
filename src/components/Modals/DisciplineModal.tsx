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
import { getQuestions, getSubgroupAnswers, getSubgroups } from "../../db/get";
import { Question } from "../../entity/Question";
import { QuestionGroup } from "../../entity/QuestionGroup";
import { QuestionSubgroup } from "../../entity/QuestionSubgroup";
import OutlinedIconButton from "../OutlinedIconButton";
import { save } from "ionicons/icons";
import { useForm } from "react-hook-form";
import { createDisciplineAnswers } from "../../db/createDisciplineAnswer";
import { useParticipant } from "../../context/ParticipantContext";
import { Participant } from "../../entity/Participant";
import { AppDataSource } from "../../App";

interface ModalProps {
  questionGroup: QuestionGroup;
  dismiss: (test: boolean) => void;
}

const DisciplineModal: React.FC<ModalProps> = ({ questionGroup, dismiss }) => {
  const [subgroups, setSubgroups] = useState<QuestionSubgroup[]>([]);
  const [selectedSubgroup, setSelectedSubgroup] = useState<QuestionSubgroup>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [description, setDescription] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>([]);
  const { register, handleSubmit } = useForm();
  const { selectedParticipant } = useParticipant();

  const defineSubgroups = async () => {
    let result = await getSubgroups(questionGroup);
    setSubgroups(result);
    setSelectedSubgroup(result[0]);
  };

  const getSubgroupQuestions = async (subgroup: QuestionSubgroup) => {
    let result = await getQuestions(subgroup);
    setDescription(result[0].description);
    setQuestions(result);
  };

  const changeSubgroup = async (subgroupName: string) => {
    let subgroup = await AppDataSource.manager.find(QuestionSubgroup, {
      where: {
        name: subgroupName,
      },
    });
    if (subgroup[subgroup.length - 1]) {
      getSubgroupQuestions(subgroup[subgroup.length - 1]);
      setSelectedSubgroup(subgroup[subgroup.length - 1]);
    }
  };

  const defineAnswers = async (subgroup: QuestionSubgroup) => {
    const answers = await getSubgroupAnswers(
      selectedParticipant,
      questions,
      subgroup
    );
    setAnswers(answers);
  };

  const onSubmit = async (
    data: any,
    selectedParticipant: Participant,
    questions: Question[]
  ) => {
    // very important to wait here, in order to update the QuestionGroupCard!
    await createDisciplineAnswers(data, selectedParticipant, questions);
    dismiss(true);
  };

  useEffect(() => {
    defineSubgroups();
  }, []);
  useEffect(() => {
    getSubgroupQuestions(subgroups[0]);
  }, [subgroups]);
  useEffect(() => {
    if (subgroups.length > 1) {
      defineAnswers(selectedSubgroup!);
    } else {
      // if only one subgroup
      defineAnswers(subgroups[0]);
    }
  }, [questions]);

  return (
    <IonContent className="ion-padding">
      <h3 className="flex justify-center font-bold text-xl">
        {questionGroup.name}
      </h3>
      {description ? (
        <p className="flex justify-center text-blue-600">{description}</p>
      ) : (
        <p className="text-transparent">null</p>
      )}
      {subgroups.length > 1 ? (
        <div className="flex justify-center">
          <IonList>
            <IonItem lines="none">
              <IonSelect
                {...register("subgroup")}
                interface="popover"
                placeholder={subgroups[0].name}
                onIonChange={(e) => changeSubgroup(e.detail.value)}
              >
                {subgroups.map((choice: QuestionSubgroup, index: number) => (
                  <IonSelectOption
                    key={index}
                    value={choice.name}
                    className="text-sm"
                  >
                    {choice.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonList>
        </div>
      ) : null}
      <div className="h-2/3 grid content-around justify-center">
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
      <div className="flex justify-center">
        <OutlinedIconButton
          onClick={handleSubmit((data) =>
            onSubmit(data, selectedParticipant, questions)
          )}
          style={"modal-button"}
          icon={save}
          label={"Speichern"}
        />
      </div>
    </IonContent>
  );
};

export default DisciplineModal;