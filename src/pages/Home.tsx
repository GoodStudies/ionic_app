import { IonButton } from "@ionic/react";
import { get_groups } from "../api/endpoints";
import { sendGetRequest } from "../api/getRequests";
import PageLayout from "../components/PageLayout";
import { createSubgroups } from "../db/createGroups";

const HomeContent: React.FC = () => {
  const fetch = async () => {
    const response = await sendGetRequest(get_groups);
    console.log(response[0].question_sub_groups);
  };

  return (
    <p>
      Home Content
      <IonButton onClick={fetch}>fetch</IonButton>
    </p>
  );
};

const Home: React.FC = () => {
  return <PageLayout title="Home" content={HomeContent} />;
};

export default Home;
