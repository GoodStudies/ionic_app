import { AppDataSource } from "../App";
import { FieldValues, UseFormRegister } from "react-hook-form";
import {
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { Question } from "../entity/Question";
import { useState, useEffect } from "react";
import { QuestionMultipleChoice } from "../entity/QuestionMultipleChoice";

interface Props {
  question: Question;
  index: number;
  register: UseFormRegister<FieldValues>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formattedDate: string | string[] | null;
  answers?: any[];
}

const FixedQuestions: React.FC<Props> = ({
  question,
  index,
  register,
  setOpen,
  formattedDate,
  answers,
}) => {
  const [mp, setMp] = useState<QuestionMultipleChoice[]>([]);

  useEffect(() => {
    async function checkMpQuestions(question: Question) {
      const result = await AppDataSource.manager.find(QuestionMultipleChoice, {
        where: {
          question: question,
        },
      });
      if (result.length > 0) {
        setMp(result);
      } else {
        setMp([]);
      }
    }
    checkMpQuestions(question);
  }, []);

  return (
    <>
      {mp.length > 0 ? (
        <>
          <IonList key={index}>
            <IonItem key={index}>
              <IonLabel position="stacked">{question.question}</IonLabel>
              <IonSelect
                {...register(question.question)}
                interface="popover"
                placeholder={answers![index]}
              >
                {mp.map((choice: QuestionMultipleChoice, index: number) => (
                  <IonSelectOption key={index} value={choice.value}>
                    {choice.value}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonList>
        </>
      ) : (
        <>
          <IonItem key={index}>
            <IonLabel position="stacked">{question.question}</IonLabel>
            {question.question == "Geburtsdatum" ? (
              <>
                <button className="date-picker" onClick={() => setOpen(true)}>
                  {formattedDate}
                </button>
              </>
            ) : (
              <IonInput
                {...register(question.question)}
                placeholder={answers![index]}
              />
            )}
          </IonItem>
        </>
      )}
    </>
  );
};

export default FixedQuestions;
