import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
      <h1 className="text-xl font-bold">EasyFind</h1>
      <div className="flex gap-4">
        {user && (
          <>
          <button
              onClick={() => navigate('/dashboard/report-item')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Report Item
            </button>
            <button
              onClick={() => navigate('/dashboard/search-item')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Search Item
            </button>
            <button
              onClick={() => navigate('/dashboard/user-profile')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              User Profile
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
