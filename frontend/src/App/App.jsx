import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../components/UserHome';
import SetPassword from '../components/SetPassword';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import UserProfile from '../components/UserProfile';
import ReportItem from '../components/ReportItem';
import SearchItem from '../components/SearchItem';
import NotifyLostItem from '../components/NotifyLostItem'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<GoogleLoginButton />} />
          <Route path="/set-password" element={
            <ProtectedRoute>
              <SetPassword />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/user-profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/report-item" element={
            <ProtectedRoute>
              <ReportItem />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/search-item" element={
            <ProtectedRoute>
              <SearchItem />
            </ProtectedRoute>
          } />  
          <Route path="/dashboard/lost-item" element={
            <ProtectedRoute>
             <NotifyLostItem/>
            </ProtectedRoute>
          } />  

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
