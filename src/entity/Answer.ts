import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Participant } from "./Participant";
import { Question } from "./Question";

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  local_id!: number;

  @Column("int", { nullable: true })
  id!: number;

  @Column("text", { nullable: true })
  value!: string;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: "SET NULL",
  })
  question!: Question;

  @ManyToOne(() => Participant, (participant) => participant.answers, {
    onDelete: "SET NULL",
    cascade: true,
  })
  participant!: Participant;
}
