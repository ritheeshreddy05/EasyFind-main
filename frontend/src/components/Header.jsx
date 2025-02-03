import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
      <h1 className="text-xl font-bold">Lost and Found System</h1>
      {user && (
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;