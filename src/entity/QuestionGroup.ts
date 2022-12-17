import { Entity, PrimaryGeneratedColumn , Column, ManyToOne, OneToMany } from 'typeorm';
import { QuestionSubgroup } from './QuestionSubgroup';

@Entity()
export class QuestionGroup {
	@PrimaryGeneratedColumn()
	local_id!: number;

	@Column('int', {nullable: true})
	id!: number;

	@Column('text', {nullable: true})
	name!: string;

	@Column('int', {nullable: true})
	is_fixed!: boolean;

	@OneToMany(() => QuestionSubgroup, (questionSubgroup) => questionSubgroup.questionGroup, {
		onDelete: 'SET NULL'
	})
	question_subgroups!: QuestionSubgroup[];
}