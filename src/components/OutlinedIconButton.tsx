import { IonButton, IonIcon } from "@ionic/react"

interface OutlinedIconButtonProps {
	onClick?: () => void,
	label: string,
	icon: any,
}

const OutlinedIconButton: React.FC<OutlinedIconButtonProps> = ({
	onClick,
	label,
	icon
}) => {
	return (
		<IonButton className='button text-sm' color={'white'} onClick={onClick}>
			<IonIcon icon={icon} className='text-sm'/>
			{label}
		</IonButton>
	)
}

export default OutlinedIconButton