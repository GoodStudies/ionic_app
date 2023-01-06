import { IonButton, IonIcon } from "@ionic/react";

interface OutlinedIconButtonProps {
  onClick?: () => void;
  label: string;
  icon?: any;
  style: any;
}

const OutlinedIconButton: React.FC<OutlinedIconButtonProps> = ({
  onClick,
  label,
  icon,
  style,
}) => {
  return (
    <IonButton className={style} color={"white"} onClick={onClick}>
      {icon ? <IonIcon icon={icon} className="text-sm" /> : null}
	  {icon ? <span className="pl-1">{label}</span> : <span>{label}</span>}
    </IonButton>
  );
};

export default OutlinedIconButton;
