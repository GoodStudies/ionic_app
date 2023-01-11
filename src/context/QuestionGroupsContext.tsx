import { createContext, useContext, useState } from "react";
import { QuestionGroup } from "../entity/QuestionGroup";


type ContextType = {
	questionGroups: QuestionGroup[];
	setQuestionGroups: React.Dispatch<React.SetStateAction<QuestionGroup[]>>;
}

const QuestionGroupsContext = createContext<ContextType>({} as ContextType);

interface Props {
	children: React.ReactNode;
}

const QuestionGroupsProvider: React.FC<Props> = ({ children }) => {
  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>([]);

  return (
    <QuestionGroupsContext.Provider
	value={{ questionGroups, setQuestionGroups }}>
		{children}
	</QuestionGroupsContext.Provider>
  );
}

export default QuestionGroupsProvider;

export const useQuestionGroups = () => useContext(QuestionGroupsContext);