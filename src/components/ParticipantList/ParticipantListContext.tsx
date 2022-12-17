import React, { useState } from "react";
import { createContext, useContext } from "react";
import { Participant } from "../../entity/Participant";
import { participantList } from "../../App";


type ContextType = {
	newParticipantList: Participant[],
	setParticipantList: React.Dispatch<React.SetStateAction<Participant[]>>
}

const ParticipantListContext = createContext<ContextType>({} as ContextType);

interface Props {
	children: React.ReactNode
}

const ContextProvider: React.FC<Props> = ({ children }) => {
	const [newParticipantList, setParticipantList] = useState(participantList);

	return (
		<ParticipantListContext.Provider value={{ newParticipantList, setParticipantList }}>
			{children}
		</ParticipantListContext.Provider>
	)
}

export default ContextProvider;

export const useParticipantList = () => useContext(ParticipantListContext);