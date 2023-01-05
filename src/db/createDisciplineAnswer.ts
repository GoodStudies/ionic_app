import { AppDataSource } from "../App";
import { Answer } from "../entity/Answer";
import { Participant } from "../entity/Participant";
import { Question } from "../entity/Question";

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
