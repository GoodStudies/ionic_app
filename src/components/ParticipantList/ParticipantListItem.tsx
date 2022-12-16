/* Later, the actual Participant objects will be parsed of course */
// import { Participant } from '../entity/Participant';

import { AppDataSource, fixedQuestions, participantList } from '../../App';
import { personAdd } from 'ionicons/icons';
import { IonCard, IonCol, IonIcon, IonRow, useIonModal } from '@ionic/react';
import { Participant } from '../../entity/Participant';
import { Question } from '../../entity/Question';
import { Answer } from '../../entity/Answer';
import { useEffect, useState } from 'react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import ParticipantModal from '../ParticipantModal';

interface ParticipantListItemProps {
	participant: any,
}

const ParticipantListItem: React.FC<ParticipantListItemProps> = (
	{
		participant: Participant
	}
) => {

	return (
		<IonCard className='p-1 m-4'>
			<IonRow>
				<IonCol>
					{Participant.firstname}
				</IonCol>
				<IonCol>
					{Participant.lastname}
				</IonCol>
				<IonCol>
					{Participant.birthdate}
				</IonCol>
				<IonCol className='italic text-[#2A6BF2]' push='1'>
					bearbeiten
					<IonIcon icon={personAdd}></IonIcon>
				</IonCol>
			</IonRow>
		</IonCard>
	)
}

export default ParticipantListItem