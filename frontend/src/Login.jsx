import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Brain, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('import.meta.env.VITE_API_URL/api/login/', credentials);
      if (response.data.success) {
        // Store a simple auth flag in local storage to keep them logged in
        localStorage.setItem('recruiterAuth', 'true');
        localStorage.setItem('recruiterName', response.data.username);
        // Redirect to the Command Center
        navigate('/overview');
      }
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#1ed760] selection:text-black">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1ed760] opacity-5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#121212] border border-[#242424] rounded-2xl p-8 relative z-10 shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-[#181818] w-16 h-16 rounded-2xl border border-[#242424] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(30,215,96,0.1)]">
             <ShieldCheck size={32} className="text-[#1ed760]" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Secure Portal</h2>
          <p className="text-[#a7a7a7] text-sm">Log in to access the NexusHire Pipeline.</p>
        </div>

        {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] text-sm font-bold p-4 rounded-lg mb-6 text-center animate-pulse">
                {error}
            </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#a7a7a7] uppercase tracking-wider mb-2">Username</label>
            <div className="relative">
                <User size={18} className="absolute left-4 top-3.5 text-[#a7a7a7]" />
                <input 
                    type="text" 
                    name="username" 
                    required 
                    onChange={handleInputChange} 
                    className="w-full bg-[#181818] border border-[#242424] rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#1ed760] transition-colors" 
                    placeholder="Enter your admin username" 
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#a7a7a7] uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-[#a7a7a7]" />
                <input 
                    type="password" 
                    name="password" 
                    required 
                    onChange={handleInputChange} 
                    className="w-full bg-[#181818] border border-[#242424] rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[#1ed760] transition-colors" 
                    placeholder="••••••••" 
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#1ed760] text-black font-extrabold text-sm py-4 rounded-xl hover:bg-[#1fdf64] transition-all mt-6 shadow-[0_0_15px_rgba(30,215,96,0.2)] hover:shadow-[0_0_25px_rgba(30,215,96,0.4)] flex justify-center items-center gap-2"
          >
            {loading ? "Authenticating..." : <><Brain size={18}/> Access Command Center</>}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#242424] pt-6">
            <Link to="/jobs" className="text-sm text-[#a7a7a7] hover:text-white transition-colors flex items-center justify-center gap-1 font-medium">
                I'm a candidate looking for jobs <ArrowRight size={14}/>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;