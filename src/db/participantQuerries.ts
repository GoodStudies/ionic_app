import {
  AppDataSource,
  fixedQuestions,
} from "../App";
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
    if (fixedQuestions[i].question == "Geburtsdatum") {
      answer = new Answer();
      answer.value = birthdate == "Auswaehlen" ? "keine Angabe" : birthdate!;
      answer.participant = participant!;
    } else {
      answer = new Answer();
      answer.value = data[fixedQuestions[i].question];
      answer.participant = participant!;
    }
    let question = await AppDataSource.getRepository(Question)
      .createQueryBuilder("question")
      .where("question.question = :question", {
        question: fixedQuestions[i].question,
      })
      .getOne();
    answer!.question = question!;
    await AppDataSource.manager.save(answer);
  }
};

export const updateParticipant = async (
  data: any,
  birthdate: string | null,
  participant: Participant
) => {
  for (let i = 0; i < fixedQuestions.length; i++) {
    // if the data field is not empty, it needs to be updated
    if (data[fixedQuestions[i].question] != "") {
      let question = await AppDataSource.manager.find(Question, {
        where: {
          question: fixedQuestions[i].question,
        },
      });
      let answer = await AppDataSource.manager.find(Answer, {
        where: {
          question: question,
          participant: participant,
        },
      });
      // check whether the answer already exists
      if (answer[answer.length - 1] != undefined) {
        // if yes, update answer
        answer[answer.length - 1].value = data[fixedQuestions[i].question];
        await AppDataSource.manager.save(answer[answer.length - 1]);
      } else {
        // if no, create new answer
        let new_answer = AppDataSource.manager.create(Answer, {
          question: question[question.length - 1],
          participant: participant,
          value: data[fixedQuestions[i].question],
        });
        await AppDataSource.manager.save(new_answer);
      }
      // update the participant if firstname, lastname and birthday were changed
      if (question[question.length - 1].question == "Vorname") {
        participant.firstname = data[fixedQuestions[i].question];
      } else if (question[question.length - 1].question == "Nachname") {
        participant.lastname = data[fixedQuestions[i].question];
      }
    }
  }
  // update birthdate, reagardless of whether it was updated or not
  participant.birthdate = birthdate!;
  await AppDataSource.manager.save(participant);
};

export const deleteParticipant = async (
  participant: Participant,
  participantList: any[],
  setList: React.Dispatch<React.SetStateAction<Participant[]>>
) => {
  await AppDataSource.manager.remove(participant).then(async () => {
	await AppDataSource.manager.find(Participant).then((participant)=> {
		setList(participant);
	})
  })
};
