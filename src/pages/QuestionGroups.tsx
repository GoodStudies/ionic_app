import { groups } from "../App";
import PageLayout from "../components/PageLayout";
import { useParticipant } from "../components/ParticipantContext";
import QuestionGroupCard from "../components/QuestionGroupCard";

const QuestionGroupsContent: React.FC = () => {
  const { selectedParticipant, setSelectedParticipant } = useParticipant();
  const name =
    selectedParticipant == null ? "Che Plan" : selectedParticipant.firstname + " " + selectedParticipant.lastname;
  // group list without fixed and the duplicates
  const newGroups = groups.slice(1, groups.length / 2);

  return (
    <>
      <p className="flex justify-center text-blue-600">
        {name}
      </p>
      <QuestionGroupCard questionGroupList={newGroups} />
    </>
  );
};

const QuestionGroups: React.FC = () => {
  return <PageLayout title="Disziplinen" content={QuestionGroupsContent} />;
};

export default QuestionGroups;
