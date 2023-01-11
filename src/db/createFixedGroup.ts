import { AppDataSource, fixedQuestions } from "../App";
import { Question } from "../entity/Question";
import { QuestionGroup } from "../entity/QuestionGroup";
import { QuestionMultipleChoice } from "../entity/QuestionMultipleChoice";
import { QuestionSubgroup } from "../entity/QuestionSubgroup";

export const createFixedQuestionGroup = async () => {
  let fixedQuestionGroup: QuestionGroup;
  let fixedQuestionSubgroup: QuestionSubgroup;
  let fixedQuestion: Question;
  let fixedQuestionMultipleChoice: QuestionMultipleChoice;

  fixedQuestionGroup = AppDataSource.manager.create(QuestionGroup, {
    // needs to be retrieved from the backend as well;
    id: 1,
    name: "fixedQuestionGroup",
    is_fixed: true,
    question_subgroups: [],
  });
  fixedQuestionSubgroup = AppDataSource.manager.create(QuestionSubgroup, {
    // needs to be retrieved from the backend as well;
    id: 1,
    name: "fixedQuestionSubgroup",
    questions: [],
    questionGroup: fixedQuestionGroup,
  });
  // add subgroup to group
  fixedQuestionGroup.question_subgroups.push(fixedQuestionSubgroup);
  // create the fixed questions
  for (let i = 0; i < fixedQuestions.length; i++) {
    fixedQuestion = AppDataSource.manager.create(Question, {
      id: fixedQuestions[i].id,
      question: fixedQuestions[i].question,
      questionSubgroup: fixedQuestionSubgroup,
      questionMultipleChoices: [],
    });
    // add the fixed question to the fixed question subgroup
    fixedQuestionSubgroup.questions.push(fixedQuestion);
    // create the multiple choices for the fixed questions
    if (fixedQuestions[i].questionMultipleChoices.length > 0) {
      for (
        let j = 0;
        j < fixedQuestions[i].questionMultipleChoices.length;
        j++
      ) {
        fixedQuestionMultipleChoice = AppDataSource.manager.create(
          QuestionMultipleChoice,
          {
            id: fixedQuestions[i].questionMultipleChoices[j].id,
            value: fixedQuestions[i].questionMultipleChoices[j].value,
            question: fixedQuestion,
          }
        );
        await AppDataSource.manager.save(fixedQuestionMultipleChoice);
        fixedQuestion.questionMultipleChoices.push(fixedQuestionMultipleChoice);
      }
    }
    await AppDataSource.manager.save(fixedQuestion);
  }
  await AppDataSource.manager.save(fixedQuestionSubgroup);
  await AppDataSource.manager.save(fixedQuestionGroup);
  console.log("successfully created fixed questions group!");
};
