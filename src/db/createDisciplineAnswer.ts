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
    const answer = new Answer();
    answer.value = data[questions[i].question];
    answer.participant = participant;
    answer.question = questions[i];
    // how to push into the array properly?
    // questions[i].answers.push(answer);
    await AppDataSource.manager.save(answer);
    console.log("created answer for question: ", questions[i].question);
  }
  console.log("successfully created discipline answers");
};

export const getDisciplineAnswers = async (
  participant: Participant,
  questions: Question[]
) => {
  console.log(participant.firstname);
  for (let i = 0; i < questions.length; i++) {
    const answers = await AppDataSource.manager.find(Answer, {
      where: {
        question: questions[i],
      },
    });
    // console.log('the answer to question: ', questions[i].question, ' is: ', answers[0].value);
    console.log("answer: ", answers);
  }
};
