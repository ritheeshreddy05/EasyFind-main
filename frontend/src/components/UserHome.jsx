import Header from './NavBar';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-col items-center justify-center mt-10">
        <h1 className="text-3xl font-bold mb-4">Welcome {user?.name || 'User'}!</h1>
        <p className="text-gray-600">You are now logged in.</p>
      </div>
    </div>
  );
};



export default Dashboard;