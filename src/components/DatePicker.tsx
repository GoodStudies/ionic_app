import React, { useState } from "react";
import styled from "styled-components";
import {
  IonButton,
  IonCard,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonItem,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import useOrientation from "../hooks/useOrientation";

const DatePickerModal: React.FC = () => {
  const [value, setValue] = useState<string | string[] | null>("");
  const [open, setOpen] = useState(false);
  const { isPortrait } = useOrientation();

  const closeModal = () => {
    setOpen(false);
  };

  const onIonChangeHandler = (value: string | string[] | null) => {
    setValue(value);
    console.log("value: " + value);
  };

  return (
    <>
      <IonButton onClick={() => setOpen(true)}>Open Modal</IonButton>
      <IonModal
        isOpen={open}
        onDidDismiss={closeModal}
        className={
          isPortrait ? "modal-wrapper-vertical" : "modal-wrapper-horizontal"
        }
      >
        <IonDatetime
          onIonChange={(e) => onIonChangeHandler(e.detail.value || "")}
          value={value}
          size={"cover"}
          showDefaultButtons={true}
          preferWheel={true}
          presentation="date"
        />
      </IonModal>
    </>
  );
};

export default DatePickerModal;
