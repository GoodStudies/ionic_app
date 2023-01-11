import { sendGetRequest } from "../api/request";
import {
  get_groups,
  get_question_id,
  get_subgroups_id,
} from "../api/endpoints";
import { AppDataSource } from "../App";
import { QuestionGroup } from "../entity/QuestionGroup";
import { QuestionSubgroup } from "../entity/QuestionSubgroup";
import { Question } from "../entity/Question";
import { QuestionMultipleChoice } from "../entity/QuestionMultipleChoice";
import { deleteEverything } from "./queryDb";

// export const createGroups = async () => {
// 	try {
// 	// fetch all question groups
//     const data = await sendGetRequest(get_groups);
//     for (let i = 0; i < data.length; i++) {
// 	  let group = new QuestionGroup();
// 	  group.id = data[i].id;
// 	  group.name = data[i].name;
// 	  group.is_fixed = data[i].is_fixed;
// 	  group.question_subgroups = [];
// 	  await AppDataSource.manager.save(group);
//       // I need to pass the questionGroup name to this function later on
//       createSubgroups(group, data[i].question_sub_groups);
//     }
//   } catch (err) {
//     console.log("Error while creating questionGroups: ", err);
//   }
// };

// // ignore the fixed subgroup here first. after everything is working, the fixed group + subgroup will be fetched inside this call as well
// // this function takes a questionGroup and creates all subgroups for that group
// export const createSubgroups = async (
//   group: QuestionGroup,
//   subgroups: QuestionSubgroup[]
// ) => {
//   console.log("Subgroups Length: ", subgroups.length);
//   try {
//     for (let i = 0; i < subgroups.length; i++) {
//       let subgroup = new QuestionSubgroup();
// 	  subgroup.id = subgroups[i].id;
// 	  subgroup.name = subgroups[i].name;
// 	  subgroup.questionGroup = group;
// 	  subgroup.questions = [];
// 	  await AppDataSource.manager.save(subgroup);
// 	  group.question_subgroups.push(subgroup);
// 	  createQuestions(subgroup);
// }
//   } catch (err) {
//     console.log("Error while creating subgroups: ", err);
//   }
// };

// // create the questions for a subgroup
// export const createQuestions = async (
//   subgroup: QuestionSubgroup
// ) => {
//   try {
//     // add the id at the end of api endpoint
//     const data = await sendGetRequest(
//       get_subgroups_id + "/" + subgroup.id.toString()
//     );
//     for (let i = 0; i < data.questions.length; i++) {
//       // create the question
// 	    let question = new Question();
// 		question.id = data.questions[i].id;
// 		question.question = data.questions[i].question_name;
// 		question.description = data.questions[i].description;
// 		question.unit = data.questions[i].unit;
// 		question.questionSubgroup = subgroup;
// 		question.answers = [];
// 		question.questionMultipleChoices = [];
// 		await AppDataSource.manager.save(question);
//         subgroup.questions.push(question);
//         createMultipleChoiceQuestions(question);
//     }
//   } catch (err) {
//     console.log("Error while creating questions: ", err);
//   }
// };

// // create multiple choice questions for a question, if any
// export const createMultipleChoiceQuestions = async (question: Question) => {
//   try {
//     const data = await sendGetRequest(get_question_id + question.id);
//     for (let i = 0; i < data.multiple_choices.length; i++) {
//       // create the multiple choice question
// 	  let mpQuestion = new QuestionMultipleChoice();
// 	  mpQuestion.id = data.multiple_choices[i].id;
// 	  mpQuestion.value = data.multiple_choices[i].value;
// 	  mpQuestion.question = question;
// 	  await AppDataSource.manager.save(mpQuestion);
//     //   question.questionMultipleChoices.push(mpQuestion);
// 	  question.questionMultipleChoices = [mpQuestion];
// 	  await AppDataSource.manager.save(question);
//     }
//   } catch (err) {
//     console.log("Error while creating multiple choice questions: ", err);
//   }
// };

export const createGroups = async () => {
	try {
	  const data = await sendGetRequest(get_groups);
	  for (let i = 0; i < data.length; i++) {
		let questionGroup = new QuestionGroup();
		questionGroup.id = data[i].id;
		questionGroup.name = data[i].name;
		questionGroup.is_fixed = data[i].is_fixed;
		questionGroup.question_subgroups = [];
		await AppDataSource.manager.save(questionGroup);
		createSubgroups(data[i].question_sub_groups, questionGroup);
	  }
	} catch (err) {
	  console.log("Error while creating questionGroups: ", err);
	}
  };

  // ignore the fixed subgroup here first. after everything is working, the fixed group + subgroup will be fetched inside this call as well
  // this function takes a questionGroup and creates all subgroups for that group
  export const createSubgroups = async (
	subgroups: any,
	questionGroup: QuestionGroup
  ) => {
	try {
	  for (let i = 0; i < subgroups.length; i++) {
		let questionSubgroup = new QuestionSubgroup();
		console.log("check the IDs: ", subgroups[i].id);
		questionSubgroup.id = subgroups[i].id;
		questionSubgroup.name = subgroups[i].name;
		questionSubgroup.questionGroup = questionGroup;
		questionSubgroup.questions = [];
		await AppDataSource.manager.save(questionSubgroup);
		questionGroup.question_subgroups.push(questionSubgroup);
		createQuestions(questionSubgroup);
	  }
	} catch (err) {
	  console.log("Error while creating subgroups: ", err);
	}
  };

  // create the questions for a subgroup
  export const createQuestions = async (questionSubgroup: QuestionSubgroup) => {
	try {
	  // add the id at the end of api endpoint
	  const data = await sendGetRequest(
		get_subgroups_id + "/" + questionSubgroup.id.toString()
	  );
	  for (let i = 0; i < data.questions.length; i++) {
		let question = new Question();
		question.id = data.questions[i].id;
		question.question = data.questions[i].question_name;
		question.description = data.questions[i].description;
		question.unit = data.questions[i].unit;
		question.questionSubgroup = questionSubgroup;
		question.answers = [];
		question.questionMultipleChoices = [];
		await AppDataSource.manager.save(question);
		questionSubgroup.questions.push(question);
		createMultipleChoiceQuestions(question);
	  }
	  await AppDataSource.manager.save(questionSubgroup);
	} catch (err) {
	  console.log("Error while creating questions: ", err);
	}
  };

  // create mutliple choice questions for a question, if any
  export const createMultipleChoiceQuestions = async (question: Question) => {
	try {
	  const data = await sendGetRequest(get_question_id + question.id.toString());
	//   console.log("MP LENGTH: ", data.multiple_choices.length);
	  for (let i = 0; i < data.multiple_choices.length; i++) {
		let mpQuestion = new QuestionMultipleChoice();
		mpQuestion.id = data.multiple_choices[i].id;
		mpQuestion.value = data.multiple_choices[i].value;
		mpQuestion.question = question;
		console.log("PUSHED: ", mpQuestion.value);
		await AppDataSource.manager.save(mpQuestion);
		question.questionMultipleChoices.push(mpQuestion);
	  }
	  await AppDataSource.manager.save(question);
	} catch (err) {
	  console.log("Error while creating multiple choice questions: ", err);
	}
  };

// fetches all questions (except fixed atm)
export const fetchAndCreateStudyQuestions = async () => {
    try {
      await createGroups().then(() => {
        console.log("fetched and created the whole study");
      });
    } catch (err) {
      console.log("Error while fetching and creating the study: ", err);
    }
};
