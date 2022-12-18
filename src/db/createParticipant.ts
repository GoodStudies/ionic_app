import { AppDataSource, fixedQuestions, participantList } from "../App";
import { Answer } from "../entity/Answer";
import { Participant } from "../entity/Participant";
import { Question } from "../entity/Question";

export const createParticipant = async (
  data: any,
  birthdate: string | undefined
) => {
  let answer;
  const participant = AppDataSource.manager.create(Participant, {
    firstname: data["Vorname"],
    lastname: data["Nachname"],
    birthdate: birthdate == "Auswaehlen" ? "keine Angabe" : birthdate,
  });
  await AppDataSource.manager.save(participant);
  // create the answers
  for (let i = 0; i < fixedQuestions.length; i++) {
    if (fixedQuestions[i].question_name === "Geburtsdatum") {
      answer = AppDataSource.manager.create(Answer, {
        value: birthdate == "Auswaehlen" ? "keine Angabe" : birthdate,
        participant: participant,
      });
    } else {
      answer = AppDataSource.manager.create(Answer, {
        value: data[fixedQuestions[i].question_name],
        participant: participant,
      });
    }
    let question = await AppDataSource.manager.findOne(Question, {
      where: {
        question: fixedQuestions[i].question_name,
      },
    });
    answer.question = question!;
    await AppDataSource.manager.save(answer);
  }
  // add participant to the participantList
  participantList.push(participant);
};
