import { redirect } from 'next/navigation';

const Home: React.FC = () => {
  redirect('/login');
  return null;
};

export default Home;
