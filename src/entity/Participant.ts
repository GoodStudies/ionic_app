import { Entity, PrimaryGeneratedColumn , Column, OneToMany } from 'typeorm';
import { Answer } from './Answer';

@Entity()
export class Participant {
	@PrimaryGeneratedColumn()
	local_id!: number;

	@Column('int', {nullable: true})
	server_id!: number;

	@Column('text', {nullable: true})
	firstname!: string;

	@Column('text', {nullable: true})
	lastname!: string;

	@Column('text', {nullable: true})
	birthdate!: string;

	@OneToMany(() => Answer, (answer) => answer.participant)
	answers!: Answer[];
}