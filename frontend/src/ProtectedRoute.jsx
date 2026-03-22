import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Check if the recruiter successfully logged in (we set this in Login.jsx)
  const isAuthenticated = localStorage.getItem('recruiterAuth') === 'true';

  // If they aren't logged in, instantly redirect them to the secure portal
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, let them access the page
  return children;
}

export default ProtectedRoute;