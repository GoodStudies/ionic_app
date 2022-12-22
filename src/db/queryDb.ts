import { AppDataSource } from "../App";
import { Answer } from "../entity/Answer";
import { Participant } from "../entity/Participant";
import { Question } from "../entity/Question";
import { QuestionGroup } from "../entity/QuestionGroup";
import { QuestionSubgroup } from "../entity/QuestionSubgroup";

export const getQuestionGroups = async () => {
  const groups = await AppDataSource.manager.find(QuestionSubgroup, {
    where: {
      questionGroup: {
        name: "Rueckwaerts Balancieren",
      },
    },
  });
  const question = await AppDataSource.manager.find(Question, {
    where: {
      questionSubgroup: {
        name: "Seitliches Umsetzen",
      },
    },
  });
  console.log("questions: ", question);
};

export const deleteEverything = async () => {
  // await AppDataSource.manager.clear(QuestionGroup);
  // await AppDataSource.manager.clear(QuestionSubgroup);
  // await AppDataSource.manager.clear(Answer);
  // await AppDataSource.manager.clear(Question);
  // await AppDataSource.manager.clear(Participant);
  console.log("deleted everything");
};

export const findAll = async () => {
  const groups = await AppDataSource.manager.find(Answer);
  console.log("groups: ", groups);
};

export const getSubgroupQuestions = async (questionGroup: QuestionGroup) => {
  const subgroups = await AppDataSource.manager.find(QuestionSubgroup, {
    where: {
      questionGroup: {
        name: questionGroup.name,
      },
    },
  });
  return subgroups;
};

export const getQuestions = async (questionSubgroup: QuestionSubgroup) => {
  const questions = await AppDataSource.manager.find(Question, {
    where: {
      questionSubgroup: {
        name: questionSubgroup.name,
      },
    },
  });
  console.log("questions: ", questions);
  return questions;
};
