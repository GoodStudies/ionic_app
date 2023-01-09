import { AppDataSource } from "../App";
import { Answer } from "../entity/Answer";
import { Participant } from "../entity/Participant";
import { Question } from "../entity/Question";
import { QuestionGroup } from "../entity/QuestionGroup";
import { QuestionSubgroup } from "../entity/QuestionSubgroup";
import { groups } from "../App";

export const deleteEverything = async () => {
  await AppDataSource.manager.clear(QuestionGroup);
  await AppDataSource.manager.clear(QuestionSubgroup);
  await AppDataSource.manager.clear(Answer);
  await AppDataSource.manager.clear(Question);
  await AppDataSource.manager.clear(Participant);
  console.log("DELETED EVERYTHING");
};

export const findAll = async () => {
  const groups = await AppDataSource.manager.find(QuestionGroup);
  console.log("groups: ", groups);
};

export const getSubgroups = async (questionGroup: QuestionGroup) => {
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

export const getAnswers = async (
  participant: Participant,
  questions: any[]
) => {
  let new_answers: string[] = [];
  for (let i = 0; i < questions.length; i++) {
    const question = await AppDataSource.manager.find(Question, {
      where: {
        question: questions[i].question_name,
      },
    });
    const answer = await AppDataSource.manager.find(Answer, {
      where: {
        participant: participant,
        question: question[question.length - 1],
      },
    });
    // if answer was not provided yet
    if (answer[answer.length - 1] != undefined) {
      new_answers.push(answer[answer.length - 1].value);
    } else {
      new_answers.push("keine Angabe");
    }
  }
  return new_answers;
};

export const getSubgroupAnswers = async (
  participant: Participant,
  questions: Question[],
  subgroupQuestions: QuestionSubgroup
) => {
  let new_answers: string[] = [];
  // iterate trough all questions inside the question group
  for (let i = 0; i < questions.length; i++) {
    const question = await AppDataSource.manager.find(Question, {
      where: {
        question: questions[i].question,
        questionSubgroup: subgroupQuestions,
      },
    });
    const answer = await AppDataSource.manager.find(Answer, {
      where: {
        participant: participant,
        question: question[question.length - 1],
      },
    });
    if (
      answer[answer.length - 1] != undefined &&
      answer[answer.length - 1].value != ""
    ) {
      new_answers.push(answer[answer.length - 1].value);
    } else {
      new_answers.push("keine Angabe");
    }
  }
  return new_answers;
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

// somehow this doesn't seem to work properly
export const createFixedQuestions = async (fixedQuestions: Question[]) => {
	let group = await AppDataSource.manager.find(QuestionGroup, {
		where: {
			name: "fixed"
		}
	});
	// the most recent group
	const fixedGroup = group[group.length - 1];
	console.log("FIXED GROUP FOUND", fixedGroup);
	let subgroup = await AppDataSource.manager.find(QuestionSubgroup, {
		where : {
			questionGroup: fixedGroup
		}
	});
	const fixedSubgroup = subgroup[subgroup.length - 1];
	console.log("FIXED SUBGROUP FOUND", fixedSubgroup.name);
	// for (let i = 0; i < fixedSubgroup.questions.length; i++) {
	// 	fixedQuestions.push(fixedSubgroup.questions[i]);
	// }
	console.log("FIXED SUB LENGTH: ", fixedSubgroup.questions);
	console.log("SUCCESSFULLY CREATED FIXED QUESTIONS");
}