import { AppDataSource } from "../App";
import { Answer } from "../entity/Answer";
import { Participant } from "../entity/Participant";
import { Question } from "../entity/Question";
import { QuestionGroup } from "../entity/QuestionGroup";
import { QuestionSubgroup } from "../entity/QuestionSubgroup";

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
		  question: questions[i].question,
		},
	  });
	  const answer = await AppDataSource.manager.find(Answer, {
		where: {
		  participant: participant,
		  question: question[question.length - 1],
		},
	  });
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