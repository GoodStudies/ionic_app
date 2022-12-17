import { IonButton, IonIcon } from "@ionic/react"

interface OutlinedIconButtonProps {
	onClick?: () => void,
	label: string,
	icon: any,
	style: any
}

const OutlinedIconButton: React.FC<OutlinedIconButtonProps> = ({
	onClick,
	label,
	icon,
	style
}) => {
	return (
		<IonButton className={style} color={'white'} onClick={onClick}>
			<IonIcon icon={icon} className='text-sm'/>
			{label}
		</IonButton>
	)
}

export default OutlinedIconButton