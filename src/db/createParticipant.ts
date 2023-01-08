import { AppDataSource, fixedQuestions, participantList } from "../App";
import { Answer } from "../entity/Answer";
import { Participant } from "../entity/Participant";
import { Question } from "../entity/Question";

export const createParticipant = async (
  data: any,
  birthdate: string | undefined
) => {
  let answer: Answer;
  // create the participant
  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Participant)
    .values([
      {
        firstname: data["Vorname"],
        lastname: data["Nachname"],
        birthdate: birthdate == "Auswaehlen" ? "keine Angabe" : birthdate,
      },
    ])
    .execute();
  // get the participant
  const participant = await AppDataSource.getRepository(Participant)
    .createQueryBuilder("participant")
    .where("participant.firstname = :name", { name: data["Vorname"] })
    .andWhere("participant.lastname = :lastname", {
      lastname: data["Nachname"],
    })
    .getOne();
  // create the answers
  for (let i = 0; i < fixedQuestions.length; i++) {
    if (fixedQuestions[i].question_name == "Geburtsdatum") {
      answer = new Answer();
      answer.value = birthdate == "Auswaehlen" ? "keine Angabe" : birthdate!;
	  answer.participant = participant!;
    } else {
      answer = new Answer();
      answer.value = data[fixedQuestions[i].question_name];
      answer.participant = participant!;
    }
    let question = await AppDataSource.getRepository(Question)
      .createQueryBuilder("question")
      .where("question.question = :question", {
        question: fixedQuestions[i].question_name,
      })
      .getOne();
    answer!.question = question!;
    await AppDataSource.manager.save(answer);
  }
  participantList.push(participant!);
};
