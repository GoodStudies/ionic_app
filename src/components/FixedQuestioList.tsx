import { fixedQuestions } from "../App";
import { useForm } from "react-hook-form";
import { IonInput, IonItem, IonLabel } from "@ionic/react";

const FixedQuestionsList: React.FC = () => {
	const { register, handleSubmit } = useForm();

	return(
		<>
		{
			fixedQuestions.map((question, index) => (
				<IonItem>
					<IonLabel position='stacked'>{question.question_name}</IonLabel>
					<IonInput {...register(question.question_name)} placeholder={question.question_name}/>
				</IonItem>
			))
		}
		</>
	);
}

export default FixedQuestionsList;