import { Entity, PrimaryGeneratedColumn , Column, ManyToOne, BaseEntity } from 'typeorm';
import { Question } from './Question';
import 'reflect-metadata';

@Entity()
export class QuestionMultipleChoice {
	@PrimaryGeneratedColumn()
	local_id!: number;

	@Column('int', {nullable: true})
	id!: number;

	@Column('text', {nullable: true})
	value!: string;

	@ManyToOne(() => Question, (question) => question.questionMultipleChoices)
	question!: Question;
}