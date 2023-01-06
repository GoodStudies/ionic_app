import { AppDataSource } from "../App";
import { Answer } from "../entity/Answer";
import { Participant } from "../entity/Participant";
import { Question } from "../entity/Question";
import { QuestionSubgroup } from "../entity/QuestionSubgroup";

export const createDisciplineAnswers = async (
  data: any,
  participant: Participant,
  questions: Question[]
) => {
  for (let i = 0; i < questions.length; i++) {
    if (data[questions[i].question] != "") {
      const answer = new Answer();
      answer.value = data[questions[i].question];
      answer.participant = participant;
      answer.question = questions[i];
      // how to push into the array properly?
      // questions[i].answers.push(answer);
      await AppDataSource.manager.save(answer);
      console.log("created answer for question: ", questions[i].question);
    }
  }
  console.log("successfully created discipline answers");
};

export const createSpecialDisciplineAnswers = async (
  data: any,
  selectedParticipant: Participant,
  selectedQuestion: Question,
  subgroups: QuestionSubgroup[]
) => {
  for (let i = 0; i < subgroups.length; i++) {
    if (data[subgroups[i].name] != "") {
      // find the right question first
      const question = await AppDataSource.manager.find(Question, {
        where: {
          question: selectedQuestion.question,
          questionSubgroup: subgroups[i],
        },
      });
      const answer = new Answer();
      answer.value = data[subgroups[i].name];
      answer.participant = selectedParticipant;
      answer.question = question[question.length - 1];
      await AppDataSource.manager.save(answer);
      console.log("created answer for question: ", selectedQuestion.question);
    }
  }
  console.log("successfully created special discipline answers");
};
