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

export const createGroups = async () => {
  try {
    // fetch all question groups
    const data = await sendGetRequest(get_groups);
    console.log("DATA:", data);
    for (let i = 0; i < data.length; i++) {
      console.log("INSIDE CREATE GROUPS");
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(QuestionGroup)
        .values([
          {
            id: data[i].id,
            name: data[i].name,
            is_fixed: data[i].is_fixed,
            question_subgroups: [],
          },
        ])
        .execute();
      // I need to pass the questionGroup name to this function later on
      createSubgroups(data[i].question_sub_groups, data[i].name);
    }
  } catch (err) {
    console.log("Error while creating questionGroups: ", err);
  }
};

// ignore the fixed subgroup here first. after everything is working, the fixed group + subgroup will be fetched inside this call as well
// this function takes a questionGroup and creates all subgroups for that group
export const createSubgroups = async (
  subgroups: any,
  questionGroupName: string
) => {
  try {
    // fetch the questionGroup from the database
    const questionGroup = await AppDataSource.getRepository(QuestionGroup)
      .createQueryBuilder("questionGroup")
      .where("questionGroup.name = :name", { name: questionGroupName })
      .getOne();
    console.log("Question Group ID: ", questionGroup?.id);
    for (let i = 0; i < subgroups.length; i++) {
      // create the questionSubgroup
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(QuestionSubgroup)
        .values([
          {
            id: subgroups[i].id,
            name: subgroups[i].name,
            questionGroup: questionGroup!,
			questions: [],
          },
        ])
        .execute();
      createQuestions(subgroups[i].name, subgroups[i].id);
    }
  } catch (err) {
    console.log("Error while creating subgroups: ", err);
  }
};

// create the questions for a subgroup
export const createQuestions = async (questionSubgroupName: string, questionSubgroupId: number) => {
  try {
    // fetch the questionSubgroup from the database
	// we need to have the ID of the subgorup here
    const questionSubgroup = await AppDataSource.getRepository(QuestionSubgroup)
      .createQueryBuilder("questionSubgroup")
      .where("questionSubgroup.name = :name", { name: questionSubgroupName })
	  .andWhere("questionSubgroup.id = :id", { id: questionSubgroupId })
      .getOne();
    // add the id at the end of api endpoint
    const data = await sendGetRequest(
      get_subgroups_id + "/" + questionSubgroup!.id.toString()
    );
    for (let i = 0; i < data.questions.length; i++) {
      // create the question
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Question)
        .values([
          {
            id: data.questions[i].id,
            question: data.questions[i].question_name,
            description: data.questions[i].description,
            unit: data.questions[i].unit,
            questionSubgroup: questionSubgroup!,
            answers: [],
          },
        ])
        .execute();
      // fetch the question from the database
      const question = await AppDataSource.getRepository(Question)
        .createQueryBuilder("question")
        .where("question.id = :id", { id: data.questions[i].id })
		.andWhere("question.question = :question", { question: data.questions[i].question_name })
        .getOne();
	  // why is it not possible to push it?
    //   questionSubgroup!.questions.push(question!);
    //   createMultipleChoiceQuestions(question!);
    }
  } catch (err) {
    console.log("Error while creating questions: ", err);
  }
};

// create multiple choice questions for a question, if any
export const createMultipleChoiceQuestions = async (question: Question) => {
  try {
    const data = await sendGetRequest(get_question_id + question.id.toString());
    for (let i = 0; i < data.question_multiple_choice.length; i++) {
      // create the multiple choice question
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(QuestionMultipleChoice)
        .values([
          {
            id: data.question_multiple_choice[i].id,
            value: data.question_multiple_choice[i].value,
            question: question,
          },
        ])
        .execute();
      // fetch the multiple choice question from the database
      const mpQuestion = await AppDataSource.getRepository(
        QuestionMultipleChoice
      )
        .createQueryBuilder("questionMultipleChoice")
        .where("questionMultipleChoice.id = :id", {
          id: data.question_multiple_choice[i].id,
        })
        .getOne();
      question.questionMultipleChoices.push(mpQuestion!);
    }
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
