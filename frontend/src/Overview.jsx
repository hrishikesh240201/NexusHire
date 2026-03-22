import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Activity, Users, Briefcase, Bell, Clock, Star, ArrowRight, Zap, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function Overview() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesRes, jobsRes] = await Promise.all([
          axios.get('import.meta.env.VITE_API_URL/api/candidates/'),
          axios.get('import.meta.env.VITE_API_URL/api/jobs/')
        ]);
        setCandidates(candidatesRes.data);
        setJobs(jobsRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- DERIVED METRICS ---
  const activeJobsCount = jobs.length;
  const totalCandidates = candidates.length;
  
  // Pipeline Breakdown
  const applied = candidates.filter(c => c.status === 'APPLIED').length;
  const interviewing = candidates.filter(c => c.status === 'INTERVIEW').length;
  const offered = candidates.filter(c => c.status === 'OFFER').length;

  const chartData = [
    { name: 'Applied', count: applied },
    { name: 'Interview', count: interviewing },
    { name: 'Offer', count: offered }
  ];

  // Actionable Insights
  const topCandidates = candidates.filter(c => (c.ai_analysis?.crs_score || 0) > 75 && c.status === 'APPLIED');
  
  if (loading) {
    return <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center text-[#1ed760] font-bold tracking-widest uppercase text-sm">Initializing Command Center...</div>;
  }

  return (
    <div className="bg-black p-4 md:p-8 text-white font-sans selection:bg-[#1ed760] selection:text-black min-h-[calc(100vh-80px)]">
      <div className="max-w-[1400px] mx-auto pt-4 animate-fade-in">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
                <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Good morning.</h1>
                <p className="text-[#a7a7a7]">Here is what is happening with your hiring pipeline today.</p>
            </div>
            <div className="bg-[#181818] border border-[#242424] px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold text-[#a7a7a7]">
                <Clock size={16} className="text-[#1ed760]"/> 
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
        </div>

        {/* TOP METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-[#121212] p-6 rounded-2xl border border-[#242424] hover:border-[#404040] transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-[#181818] p-3 rounded-xl"><Briefcase size={20} className="text-white"/></div>
                    <span className="text-[#1ed760] text-xs font-bold bg-[#1ed760]/10 px-2 py-1 rounded-md">+2 this week</span>
                </div>
                <h3 className="text-[#a7a7a7] text-sm font-bold uppercase tracking-wider mb-1">Active Roles</h3>
                <p className="text-4xl font-black">{activeJobsCount}</p>
            </div>

            <div className="bg-[#121212] p-6 rounded-2xl border border-[#242424] hover:border-[#404040] transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-[#181818] p-3 rounded-xl"><Users size={20} className="text-white"/></div>
                    <span className="text-[#1ed760] text-xs font-bold bg-[#1ed760]/10 px-2 py-1 rounded-md">Live</span>
                </div>
                <h3 className="text-[#a7a7a7] text-sm font-bold uppercase tracking-wider mb-1">Total Candidates</h3>
                <p className="text-4xl font-black">{totalCandidates}</p>
            </div>

            <div className="bg-[#121212] p-6 rounded-2xl border border-[#242424] hover:border-[#1ed760]/50 transition-colors relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#1ed760] opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="bg-[#181818] p-3 rounded-xl"><Star size={20} className="text-[#1ed760]"/></div>
                </div>
                <h3 className="text-[#a7a7a7] text-sm font-bold uppercase tracking-wider mb-1 relative z-10">Top Talent (CRS {'>'} 75)</h3>
                <p className="text-4xl font-black text-white relative z-10">{topCandidates.length}</p>
            </div>

            <div className="bg-[#121212] p-6 rounded-2xl border border-[#242424] hover:border-[#404040] transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-[#181818] p-3 rounded-xl"><Activity size={20} className="text-white"/></div>
                </div>
                <h3 className="text-[#a7a7a7] text-sm font-bold uppercase tracking-wider mb-1">Interviews Scheduled</h3>
                <p className="text-4xl font-black">{interviewing}</p>
            </div>
        </div>

        {/* MAIN SPLIT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT: Analytics & Charts (Takes up 2/3) */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Chart Card */}
                <div className="bg-[#121212] p-8 rounded-2xl border border-[#242424]">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold">Pipeline Health</h2>
                        <Link to="/pipeline" className="text-sm font-bold text-[#a7a7a7] hover:text-white flex items-center gap-1">
                            View Board <ArrowRight size={16}/>
                        </Link>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="name" stroke="#a7a7a7" tick={{ fill: '#a7a7a7', fontSize: 12, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: '#181818'}} contentStyle={{ backgroundColor: '#181818', borderColor: '#333', borderRadius: '8px', color: '#fff' }} />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Interview' ? '#1ed760' : '#333'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Recommendations */}
                <div className="bg-[#121212] p-8 rounded-2xl border border-[#242424]">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Zap className="text-[#1ed760]"/> Engine Recommendations
                    </h2>
                    {topCandidates.length === 0 ? (
                        <p className="text-[#a7a7a7] text-sm">No new high-scoring candidates awaiting review.</p>
                    ) : (
                        <div className="space-y-4">
                            {topCandidates.slice(0, 3).map(c => (
                                <div key={c.id} className="bg-[#181818] border border-[#2a2a2a] p-4 rounded-xl flex justify-between items-center group">
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-[#1ed760] transition-colors">{c.full_name}</h4>
                                        <p className="text-xs text-[#a7a7a7]">Applied for {c.job?.title || 'Open Role'}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="block text-xs font-bold text-[#a7a7a7] uppercase">CRS Score</span>
                                            <span className="text-lg font-black text-[#1ed760]">{c.ai_analysis?.crs_score}</span>
                                        </div>
                                        <Link to="/pipeline" className="bg-[#242424] hover:bg-[#333] p-2 rounded-lg transition-colors">
                                            <ArrowRight size={18} className="text-white"/>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* RIGHT: Action Center & Activity (Takes up 1/3) */}
            <div className="space-y-6">
                
                {/* Action Required */}
                <div className="bg-[#181818] p-6 rounded-2xl border border-[#1ed760]/30 shadow-[0_0_20px_rgba(30,215,96,0.05)]">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                        <Bell className="text-[#1ed760]" size={18}/> Action Required
                    </h2>
                    <ul className="space-y-4">
                        {topCandidates.length > 0 && (
                            <li className="flex gap-3 items-start">
                                <div className="w-2 h-2 rounded-full bg-[#1ed760] mt-1.5 shrink-0"></div>
                                <p className="text-sm text-[#a7a7a7]">
                                    You have <span className="text-white font-bold">{topCandidates.length} unreviewed candidates</span> with a CRS score above 75. 
                                    <Link to="/pipeline" className="block mt-1 text-[#1ed760] hover:underline font-bold">Review now</Link>
                                </p>
                            </li>
                        )}
                        {jobs.length > 0 && (
                            <li className="flex gap-3 items-start">
                                <div className="w-2 h-2 rounded-full bg-[#ef4444] mt-1.5 shrink-0"></div>
                                <p className="text-sm text-[#a7a7a7]">
                                    The <span className="text-white font-bold">{jobs[0]?.title}</span> role has been open for more than 30 days. Consider syndicating to the XML feed.
                                </p>
                            </li>
                        )}
                        {interviewing > 0 && (
                             <li className="flex gap-3 items-start">
                                <div className="w-2 h-2 rounded-full bg-[#3b82f6] mt-1.5 shrink-0"></div>
                                <p className="text-sm text-[#a7a7a7]">
                                    <span className="text-white font-bold">{interviewing} candidates</span> are currently in the Interview stage awaiting feedback.
                                </p>
                            </li>
                        )}
                        {topCandidates.length === 0 && jobs.length === 0 && interviewing === 0 && (
                            <p className="text-[#a7a7a7] text-sm">You're all caught up! No pending actions.</p>
                        )}
                    </ul>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-[#121212] p-6 rounded-2xl border border-[#242424]">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Target size={18} className="text-[#a7a7a7]"/> Recent Interceptions
                    </h2>
                    <div className="space-y-5">
                        {candidates.slice(0, 4).map(c => (
                            <div key={c.id} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#242424] flex items-center justify-center font-bold text-xs text-white shrink-0">
                                    {c.full_name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm text-[#a7a7a7] leading-snug">
                                        <span className="text-white font-bold">{c.full_name}</span> applied for <span className="text-white font-medium">{c.job?.title || 'Open Role'}</span>
                                    </p>
                                    <p className="text-[10px] text-[#a7a7a7] font-bold uppercase mt-1">Recently</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
}

export default Overview;