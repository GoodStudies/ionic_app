import { AppDataSource, fixedQuestions, participantList } from "../App";
import { Answer } from "../entity/Answer";
import { Participant } from "../entity/Participant";
import { Question } from "../entity/Question";

export const createParticipant = async (
  data: any,
  birthdate: string | undefined
) => {
  let answer;
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
  console.log("SUCCESSFULLY CREATED PARTICIPANT");
  // get the participant
  const participant = await AppDataSource.getRepository(Participant)
    .createQueryBuilder("participant")
    .where("participant.firstname = :name", { name: data["Vorname"] })
    .andWhere("participant.lastname = :lastname", {
      lastname: data["Nachname"],
    })
    .getOne();
  console.log("THE FOUND PARTICIPANT IS: ", participant);
  // create the answers
  for (let i = 0; i < fixedQuestions.length; i++) {
    if (fixedQuestions[i].question_name == "Geburtsdatum") {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Answer)
        .values([
          {
            value: birthdate == "Auswaehlen" ? "keine Angabe" : birthdate,
            participant: participant!,
          },
        ])
        .execute();
    }
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(Answer)
      .values([
        {
          value: data[fixedQuestions[i].question_name],
          participant: participant!,
        },
      ])
      .execute();
    let test = await AppDataSource.getRepository(Question)
      .createQueryBuilder()
	  .select("question")
	  .from(Question, "question")
      .where("question.question = :question", {
        question: "Vorname",
      })
      .getOne();
    answer = await AppDataSource.getRepository(Answer)
      .createQueryBuilder("answer")
      .where("answer.participant = :participant", { participant: participant! })
      .andWhere("answer.value = :value", {
        value: data[fixedQuestions[i].question_name],
      })
      .getOne();
    // console.log("THE ANSWER IS: ", answer!.value);
	console.log("CURRENT INDEX: ", i);
    console.log("THE QUESTION IS: ", test!.question);
    // answer!.question = question!;
  }
  console.log("SUCCESSFULLY CREATED ANSWERS");
  //   participantList.push(participant);
};
