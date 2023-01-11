import { AppDataSource, initParticipantList } from "../App";
import { Answer } from "../entity/Answer";
import { Participant } from "../entity/Participant";
import { Question } from "../entity/Question";
import { QuestionGroup } from "../entity/QuestionGroup";
import { QuestionSubgroup } from "../entity/QuestionSubgroup";
import { groups } from "../App";
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

export const checkAllAnswers = async (participant: Participant) => {
  const questionGroups = groups.slice(1, groups.length);
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

