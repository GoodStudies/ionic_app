import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { QuestionMultipleChoice } from "./QuestionMultipleChoice";
import { QuestionSubgroup } from "./QuestionSubgroup";
import { Answer } from "./Answer";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  local_id!: number;

  @Column("int", { nullable: true })
  id!: number;

  @Column("text", { nullable: true })
  question!: string;

  @Column("text", { nullable: true })
  description!: string;

  @Column("text", { nullable: true })
  unit!: string;

  @ManyToOne(
    () => QuestionSubgroup,
    (questionSubgroup) => questionSubgroup.questions,
    {
      cascade: true,
      onDelete: "SET NULL",
    }
  )
  questionSubgroup!: QuestionSubgroup;

  @OneToMany(() => Answer, (answer) => answer.question, {
    cascade: true,
    onDelete: 'SET NULL'
  })
  answers!: Answer[];

  @OneToMany(
    () => QuestionMultipleChoice,
    (questionMultipleChoice) => questionMultipleChoice.question,
    {
      cascade: true,
      onDelete: "SET NULL",
    }
  )
  questionMultipleChoices!: QuestionMultipleChoice[];
}
