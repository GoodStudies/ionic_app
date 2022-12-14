import { Entity, PrimaryGeneratedColumn , Column, ManyToOne, OneToMany } from 'typeorm';
import { Question } from './Question';

@Entity()
export class QuestionSubgroup {
	@PrimaryGeneratedColumn()
	local_id!: number;

	@Column('int', {nullable: true})
	id!: number;

	@Column('text', {nullable: true})
	name!: string;

	@OneToMany(() => Question, (question) => question.questionSubgroup)
	questions!: Question[];
}