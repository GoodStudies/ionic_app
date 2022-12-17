import { participantList } from "../../App";
import React, { createContext, useReducer } from "react";

let ParticipantListContext = createContext({} as any);

const initialState = {
	participants: participantList,
}

let reducer = (state: any, action: any) => {
	switch(action.type) {
		case "updateParticipant": {
			return { ...state, participants: action.participants}
		}
	}
	return state;
}

function ParticipantListProvider(props: any) {
	const fullInitialState = {
		...initialState,
	}

	let [state, dispatch] = useReducer(reducer, fullInitialState);
	let value = { state, dispatch };

	return (
		<ParticipantListContext.Provider value={value}>
			{props.children}
		</ParticipantListContext.Provider>
	);
}

let ParticipantContextConsumer = ParticipantListContext.Consumer;

export { ParticipantListContext, ParticipantContextConsumer, ParticipantListProvider };