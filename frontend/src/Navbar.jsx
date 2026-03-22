import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Briefcase, LayoutDashboard, Home, PieChart, Lock, LogOut } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if the user is currently logged in
  const isAuthenticated = localStorage.getItem('recruiterAuth') === 'true';

  // Handle the logout process
  const handleLogout = () => {
    localStorage.removeItem('recruiterAuth');
    localStorage.removeItem('recruiterName');
    navigate('/login'); // Kick them back to the login screen
  };

  return (
    <nav className="border-b border-[#242424] bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="bg-[#1ed760] p-2 rounded-full shadow-[0_0_15px_rgba(30,215,96,0.2)]">
            <Brain size={22} className="text-black" />
          </div>
          <span className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
            Nexus<span className="text-[#1ed760]">Hire</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-1 md:gap-3 items-center">
          
          <Link to="/" className={`hidden md:flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-full transition-colors ${location.pathname === '/' ? 'text-white bg-[#242424]' : 'text-[#a7a7a7] hover:text-white hover:bg-[#181818]'}`}>
            <Home size={16} /> <span>Home</span>
          </Link>

          <Link to="/jobs" className={`flex items-center gap-2 text-sm font-bold px-4 py-2 md:py-2.5 rounded-full transition-colors ${location.pathname === '/jobs' ? 'text-white bg-[#242424]' : 'text-[#a7a7a7] hover:text-white hover:bg-[#181818]'}`}>
            <Briefcase size={16} /> <span className="hidden md:inline">Job Board</span>
          </Link>

          {/* SECURE LINKS: Only show if authenticated */}
          {isAuthenticated && (
            <>
              <Link to="/overview" className={`hidden lg:flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-full transition-colors ${location.pathname === '/overview' ? 'text-white bg-[#242424]' : 'text-[#a7a7a7] hover:text-white hover:bg-[#181818]'}`}>
                <PieChart size={16} /> <span>Overview</span>
              </Link>
              
              <Link to="/pipeline" className={`hidden lg:flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-full transition-colors ${location.pathname.includes('/pipeline') ? 'text-white bg-[#242424]' : 'text-[#a7a7a7] hover:text-white hover:bg-[#181818]'}`}>
                <LayoutDashboard size={16} /> <span>Pipeline</span>
              </Link>
            </>
          )}

          <div className="w-px h-6 bg-[#242424] mx-2 hidden md:block"></div>
          
          {/* LOGIN / LOGOUT TOGGLE */}
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold px-5 py-2 md:py-2.5 rounded-full transition-colors border border-[#242424] text-[#a7a7a7] hover:text-[#ef4444] hover:border-[#ef4444]/50 hover:bg-[#ef4444]/10"
            >
              <LogOut size={16} /> <span className="hidden md:inline">End Session</span>
            </button>
          ) : (
            <Link to="/login" className={`flex items-center gap-2 text-sm font-bold px-5 py-2 md:py-2.5 rounded-full transition-transform hover:scale-105 ${location.pathname === '/login' ? 'bg-[#1ed760] text-black shadow-[0_0_10px_rgba(30,215,96,0.2)]' : 'bg-white text-black'}`}>
              <Lock size={16} /> <span className="hidden md:inline">Recruiter Login</span>
            </Link>
          )}
          
        </div>

      </div>
    </nav>
  );
}

export default Navbar;