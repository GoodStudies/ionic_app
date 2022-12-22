import React, { useState } from "react";
import { createContext, useContext } from "react";
import { Participant } from "../entity/Participant";

type ContextType = {
  selectedParticipant: Participant;
  setSelectedParticipant: React.Dispatch<React.SetStateAction<Participant>>;
};

const ParticipantContext = createContext<ContextType>({} as ContextType);

interface Props {
  children: React.ReactNode;
}

const ParticipantContextProvider: React.FC<Props> = ({ children }) => {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant>(
    {} as Participant
  );

  return (
    <ParticipantContext.Provider
      value={{ selectedParticipant, setSelectedParticipant }}
    >
      {children}
    </ParticipantContext.Provider>
  );
};

export default ParticipantContextProvider;

export const useParticipant = () => useContext(ParticipantContext);
