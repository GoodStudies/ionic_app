import PageLayout from '../components/PageLayout';


const HomeContent: React.FC = () => {
	return (
		<p>
			Home Content
		</p>
	)
}

const Home: React.FC = () => {
	return (
		<PageLayout title='Home' content={HomeContent}/>
	)
}

export default Home;
