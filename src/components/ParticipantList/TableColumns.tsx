import { IonCol, IonRow } from "@ionic/react";

// I guess it needs to be 'hardcoded'
export const columnNames = ["Vorname", "Nachname", "Geburtsdatum"];

interface TableColumnsProps {
  columnNames: string[];
}

export const TableColumns: React.FC<TableColumnsProps> = ({
  columnNames: ColumnNames,
}) => {
  return (
    <IonRow className="ion-padding text-sm">
      <IonCol>{ColumnNames[0]}</IonCol>
      <IonCol>{ColumnNames[1]}</IonCol>
      <IonCol>{ColumnNames[2]}</IonCol>
      <IonCol></IonCol>
    </IonRow>
  );
};
