import { IonContent } from '@ionic/react';

interface ParticipantListProps {
	items: any[],
	component: any
}

const ParticipantList: React.FC<ParticipantListProps> = ({
	items: participantsList,
	component: Component
}) => {
	return(
		<IonContent>
		{
			participantsList.map((participant, i) => (
				<Component key={i} {...{participant}}/>
			))
		}
		</IonContent>
	)
}

export default ParticipantList