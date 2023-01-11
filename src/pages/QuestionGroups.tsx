import { useIonRouter } from "@ionic/react";
import { groups } from "../App";
import PageLayout from "../components/PageLayout";
import { useParticipant } from "../context/ParticipantContext";
import QuestionGroupCard from "../components/QuestionGroupCard";

const QuestionGroupsContent: React.FC = () => {
  const { selectedParticipant, setSelectedParticipant } = useParticipant();
  const navigation = useIonRouter();
  const name =
    selectedParticipant == null
      ? "Che Plan"
      : selectedParticipant.firstname + " " + selectedParticipant.lastname;
  // group list without fixed
  const newGroups = groups.slice(1, groups.length);

  // fix this behaviour
  document.addEventListener('ionBackButton', (ev: any) => {
	ev.detail.register(10, () => {
	  navigation.goBack();
	});
  });

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
