import { AppDataSource } from "../App";
import { Answer } from "../entity/Answer";
import { Participant } from "../entity/Participant";
import { Question } from "../entity/Question";
import { QuestionGroup } from "../entity/QuestionGroup";
import { QuestionSubgroup } from "../entity/QuestionSubgroup";
import { QuestionMultipleChoice } from "../entity/QuestionMultipleChoice";
import { getQuestions, getSubgroups } from "./get";

export const deleteEverything = async () => {
  await AppDataSource.manager.clear(QuestionGroup);
  await AppDataSource.manager.clear(QuestionSubgroup);
  await AppDataSource.manager.clear(QuestionMultipleChoice);
  await AppDataSource.manager.clear(Answer);
  await AppDataSource.manager.clear(Question);
  await AppDataSource.manager.clear(Participant);
  console.log("DELETED EVERYTHING");
};

export const checkAllAnswers = async (participant: Participant, questionGroups: QuestionGroup[]) => {
  questionGroups = questionGroups.slice(1, questionGroups.length);
  for (let i = 0; i < questionGroups.length; i++) {
    let subgroups = await getSubgroups(questionGroups[i]);
    for (let j = 0; j < subgroups.length; j++) {
      let questions = await getQuestions(subgroups[j]);
      for (let k = 0; k < questions.length; k++) {
        let answers = await AppDataSource.manager.find(Answer, {
          where: {
            participant: participant,
            question: questions[k],
          },
        });
        if (answers.length == 0) {
          return false;
        }
      }
    }
  }
  return true;
};

