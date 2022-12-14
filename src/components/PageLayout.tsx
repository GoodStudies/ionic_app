import Menu from '../pages/Menu';
import { IonContent, IonHeader, IonMenuToggle, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import OutlinedIconButton from './OutlinedIconButton';

interface PageLayoutProps {
	children?: React.ReactNode,
	onClick?: () => void,
	title: string,
	content: any,
}

const PageLayout: React.FC<PageLayoutProps> = (
	{
		children,
		onClick,
		title,
		content: Content,
	}
) => {
	return (
		<>
			<Menu/>
			<IonPage id='main'>
				<IonHeader>
					<IonToolbar>
						<IonMenuToggle>
							<button className='menu ml-2 mt-1'>svg</button>
						</IonMenuToggle>
						<IonTitle>{title}</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent className='ion-padding'>
					<Content onClick={onClick}/>
					{children}
				</IonContent>
			</IonPage>
		</>
	);
}

export default PageLayout;
