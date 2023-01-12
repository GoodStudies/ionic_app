import { useIonRouter } from "@ionic/react";
import PageLayout from "../components/PageLayout";
import { useParticipant } from "../context/ParticipantContext";
import QuestionGroupCard from "../components/QuestionGroupCard";
import { useQuestionGroups } from "../context/QuestionGroupsContext";

const QuestionGroupsContent: React.FC = () => {
  const { selectedParticipant } = useParticipant();
  const { questionGroups } = useQuestionGroups();
  const router = useIonRouter();
  const name =
    selectedParticipant == null
      ? "Che Plan"
      : selectedParticipant.firstname + " " + selectedParticipant.lastname;
  // group list without fixed
  const newGroups = questionGroups.slice(1, questionGroups.length);

  return (
    <>
      <p className="flex justify-center text-blue-600">{name}</p>
      <QuestionGroupCard questionGroupList={newGroups} />
    </>
  );
};

const QuestionGroups: React.FC = () => {
  return <PageLayout title="Disziplinen" content={QuestionGroupsContent} />;
};

export default QuestionGroups;
