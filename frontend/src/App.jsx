import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import JobBoard from './JobBoard';
import Dashboard from './Dashboard';
import Overview from './Overview';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute'; // <-- Import the Bouncer

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-[#1ed760] selection:text-black">
        <Navbar />
        <Routes>
          {/* PUBLIC ROUTES (Anyone can see these) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/login" element={<Login />} />

          {/* SECURE ROUTES (Only logged-in recruiters can see these) */}
          <Route 
            path="/overview" 
            element={
              <ProtectedRoute>
                <Overview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pipeline" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;