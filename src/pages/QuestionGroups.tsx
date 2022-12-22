import { useEffect } from "react";
import { AppDataSource, groups } from "../App";
import PageLayout from "../components/PageLayout";
import { QuestionGroup } from "../entity/QuestionGroup";
import { useParticipant } from "../components/ParticipantContext";
import { IonButton } from "@ionic/react";
import { deleteEverything } from "../db/queryDb";
import QuestionGroupCard from "../components/QuestionGroupCard";

const QuestionGroupsContent: React.FC = () => {
  const { selectedParticipant, setSelectedParticipant } = useParticipant();
  const name =
    selectedParticipant == null ? "Che Plan" : selectedParticipant.firstname;
  // group list without fixed and the duplicates
  const newGroups = groups.slice(1, groups.length / 2);

  return (
    <>
      <p className="flex justify-center">
        Willkommen zu den Disziplinen vom Nutzer {name}!
      </p>
      <QuestionGroupCard questionGroupList={newGroups} />
    </>
  );
};

const QuestionGroups: React.FC = () => {
  return <PageLayout title="Disziplinen" content={QuestionGroupsContent} />;
};

export default QuestionGroups;
