import { IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';

const Login: React.FC = () => {
	const navigation = useIonRouter();

	const doLogin = () => {
		navigation.push('/participants', 'forward', 'replace');
	}

	return(
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons>
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Login</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonButton onClick={() => doLogin()}>Login!</IonButton>
			</IonContent>
		</IonPage>
	)
}

export default Login;