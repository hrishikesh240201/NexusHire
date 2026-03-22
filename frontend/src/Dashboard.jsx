import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, BarChart2, Github, Code, Linkedin, X, Send, User, CheckCircle2, XCircle, MoreHorizontal, PlusCircle, Briefcase } from 'lucide-react';
import CandidateDetail from './CandidateDetail';

function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [detailCandidate, setDetailCandidate] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [emailType, setEmailType] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [sending, setSending] = useState(false);

  // NEW: Job Posting State
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobFormData, setJobFormData] = useState({ title: '', location: '', salary_range: '', description: '' });
  const [postingJob, setPostingJob] = useState(false);

  const ACTIVE_STAGES = ['APPLIED', 'INTERVIEW', 'OFFER'];

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/candidates/');
      setCandidates(response.data);
    } catch (err) {
      console.error("Failed to fetch candidates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleStatusChange = async (candidateId, newStatus) => {
    setCandidates(prev => prev.map(c => 
      c.id === candidateId ? { ...c, status: newStatus } : c
    ));
    try {
      await axios.post('http://127.0.0.1:8000/api/update-status/', {
        candidate_id: candidateId, status: newStatus
      });
      if (newStatus === 'INTERVIEW' || newStatus === 'REJECTED') {
          const updatedCandidate = candidates.find(c => c.id === candidateId);
          setSelectedCandidate({ ...updatedCandidate, status: newStatus });
      }
    } catch (err) {
      fetchCandidates(); 
    }
  };

  const handleGenerateEmail = (type) => {
    if (!selectedCandidate) return;
    setEmailType(type);
    const firstName = selectedCandidate.full_name.split(' ')[0] || 'Candidate';
    if (type === 'interview') {
      setGeneratedEmail(`Dear ${firstName},\n\nWe are highly impressed with your AI-analyzed profile.\n\nWe would like to invite you to a technical interview. Please let us know your availability for next week.\n\nBest regards,\nNexusHire Team`);
    } else {
      setGeneratedEmail(`Dear ${firstName},\n\nThank you for applying. After careful consideration, we have decided to move forward with other candidates.\n\nWe wish you the best in your career.\n\nBest regards,\nNexusHire Team`);
    }
  };

  const handleSendFinalEmail = async () => {
    setSending(true);
    setTimeout(() => {
        alert(`Email sent to ${selectedCandidate.full_name}!`);
        setSelectedCandidate(null); setGeneratedEmail(''); setSending(false);
    }, 1000);
  };

  // NEW: Handle Job Creation
  const handleJobCreate = async (e) => {
    e.preventDefault();
    setPostingJob(true);
    try {
        await axios.post('import.meta.env.VITE_API_URL/api/jobs/create/', jobFormData);
        alert("Job posted successfully! It is now live on the Job Board.");
        setIsJobModalOpen(false);
        setJobFormData({ title: '', location: '', salary_range: '', description: '' });
    } catch (error) {
        alert("Failed to post job. Please ensure your backend is running.");
    } finally {
        setPostingJob(false);
    }
  };

  const filteredCandidates = candidates.filter(c => 
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (detailCandidate) {
    return <CandidateDetail candidate={detailCandidate} onBack={() => {setDetailCandidate(null); fetchCandidates();}} />;
  }

  return (
    <div className="bg-black p-4 md:p-8 text-white font-sans selection:bg-[#1ed760] selection:text-black min-h-[calc(100vh-80px)]">
      
      {/* SEARCH AREA & ACTIONS */}
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4 pt-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-3 text-[#a7a7a7] group-hover:text-white transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search candidates by name..." 
                className="w-full bg-[#121212] border border-[#242424] focus:border-[#404040] hover:bg-[#181818] text-white text-sm rounded-full py-3 pl-12 pr-4 outline-none transition-colors placeholder-[#a7a7a7]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* NEW: Post Job Button */}
          <button 
            onClick={() => setIsJobModalOpen(true)}
            className="flex-1 md:flex-none bg-[#1ed760] text-black font-bold text-sm px-6 py-3 rounded-full hover:scale-105 hover:bg-[#1fdf64] transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(30,215,96,0.2)]"
          >
            <PlusCircle size={18}/> Post New Role
          </button>
          
          <div className="w-12 h-12 bg-[#121212] border border-[#242424] rounded-full flex items-center justify-center text-[#a7a7a7] hover:text-white transition-colors cursor-pointer shrink-0">
             <User size={20}/>
          </div>
        </div>
      </div>

      {/* ALBUM CARD GRID */}
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-extrabold mb-6">Candidate Library</h2>
        
        {loading ? (
          <div className="text-center py-20 text-[#a7a7a7] text-sm font-bold tracking-widest uppercase">Loading Talent Pool...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {filteredCandidates.map((c) => {
                const currentStatus = c.status || 'APPLIED';
                const isRejected = currentStatus === 'REJECTED';

                return (
                  <div key={c.id} className="bg-[#181818] hover:bg-[#282828] rounded-xl p-5 transition-all group relative border border-[#242424] hover:border-[#404040] shadow-lg flex flex-col h-full">
                      
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-3 items-center">
                              <div className="w-12 h-12 rounded-full bg-[#242424] flex items-center justify-center font-bold text-lg text-white border border-[#333]">
                                  {c.full_name.charAt(0).toUpperCase()}
                              </div>
                              <div className="overflow-hidden">
                                  <h4 className="font-bold text-white text-base truncate max-w-[140px]">{c.full_name}</h4>
                                  <p className="text-[#a7a7a7] text-xs truncate max-w-[140px]">{c.email}</p>
                              </div>
                          </div>
                          <button className="text-[#a7a7a7] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal size={20}/>
                          </button>
                      </div>

                      <div className="flex items-center justify-between mb-6 border-b border-[#333] pb-4">
                          <div>
                              <p className="text-[10px] text-[#a7a7a7] font-bold uppercase tracking-wider mb-1">CRS Score</p>
                              <span className={`text-3xl font-black ${c.ai_analysis?.crs_score > 75 ? 'text-[#1ed760]' : c.ai_analysis?.crs_score > 50 ? 'text-white' : 'text-[#ef4444]'}`}>
                                  {c.ai_analysis?.crs_score || '-'}
                              </span>
                          </div>
                          <div className="flex gap-3 text-[#a7a7a7]">
                              {c.github_link && <Github size={16} className="hover:text-white transition-colors cursor-pointer" />}
                              {c.linkedin_link && <Linkedin size={16} className="hover:text-white transition-colors cursor-pointer" />}
                              {c.leetcode_link && <Code size={16} className="hover:text-white transition-colors cursor-pointer" />}
                          </div>
                      </div>

                      <div className="mt-auto">
                          {isRejected ? (
                              <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2 text-[#ef4444] text-xs font-bold bg-[#ef4444]/10 px-3 py-1.5 rounded-md border border-[#ef4444]/20">
                                      <XCircle size={14}/> Rejected
                                  </div>
                              </div>
                          ) : (
                              <div>
                                  <div className="flex items-center w-full justify-between relative mb-2">
                                      <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#333] -z-10 -translate-y-1/2"></div>
                                      
                                      {ACTIVE_STAGES.map((stage, idx) => {
                                          const isActive = currentStatus === stage;
                                          const isPast = ACTIVE_STAGES.indexOf(currentStatus) > idx;
                                          
                                          let btnClass = "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all cursor-pointer bg-[#181818] ";
                                          
                                          if (isActive) {
                                              btnClass += "border-[#1ed760] text-[#1ed760] scale-125 bg-[#181818]";
                                          } else if (isPast) {
                                              btnClass += "border-[#1ed760] bg-[#1ed760] text-black";
                                          } else {
                                              btnClass += "border-[#404040] text-[#a7a7a7] hover:border-white hover:text-white";
                                          }

                                          return (
                                              <button key={stage} onClick={() => handleStatusChange(c.id, stage)} className={btnClass} title={`Move to ${stage}`}>
                                                  {isPast ? <CheckCircle2 size={12}/> : idx + 1}
                                              </button>
                                          );
                                      })}
                                  </div>
                                  <div className="flex justify-between items-center mt-3">
                                      <span className="text-xs font-bold text-[#a7a7a7]">{currentStatus}</span>
                                      <button onClick={() => handleStatusChange(c.id, 'REJECTED')} className="text-[#ef4444] text-[10px] font-bold uppercase tracking-wider hover:underline">
                                          Reject
                                      </button>
                                  </div>
                              </div>
                          )}
                      </div>

                      <div className="absolute bottom-[88px] right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 z-10">
                          <button onClick={() => setDetailCandidate(c)} className="bg-[#1ed760] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 hover:bg-[#1fdf64] transition-all border-4 border-[#181818] group-hover:border-[#282828]" title="View AI Analysis">
                              <BarChart2 size={24} fill="currentColor"/>
                          </button>
                      </div>
                  </div>
                );
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------- */}
      {/* NEW: JOB CREATION MODAL                     */}
      {/* ------------------------------------------- */}
      {isJobModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
           <div className="bg-[#121212] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#242424]">
             <div className="p-6 flex justify-between items-center border-b border-[#242424] bg-[#181818]">
                <h2 className="font-bold text-white text-xl flex items-center gap-2">
                    <Briefcase className="text-[#1ed760]" size={20} /> Post a New Role
                </h2>
                <button onClick={() => setIsJobModalOpen(false)} className="text-[#a7a7a7] hover:text-white rounded-full p-2 hover:bg-[#242424] transition-colors"><X size={20}/></button>
             </div>
             
             <div className="p-6">
                <form onSubmit={handleJobCreate} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-[#a7a7a7] uppercase tracking-wider mb-2">Job Title *</label>
                            <input type="text" required value={jobFormData.title} onChange={(e) => setJobFormData({...jobFormData, title: e.target.value})} className="w-full bg-[#181818] border border-[#242424] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#1ed760] transition-colors" placeholder="e.g. Senior Backend Engineer" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#a7a7a7] uppercase tracking-wider mb-2">Location *</label>
                            <input type="text" required value={jobFormData.location} onChange={(e) => setJobFormData({...jobFormData, location: e.target.value})} className="w-full bg-[#181818] border border-[#242424] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#1ed760] transition-colors" placeholder="e.g. Remote, Pune, NY" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#a7a7a7] uppercase tracking-wider mb-2">Salary Range</label>
                        <input type="text" value={jobFormData.salary_range} onChange={(e) => setJobFormData({...jobFormData, salary_range: e.target.value})} className="w-full bg-[#181818] border border-[#242424] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#1ed760] transition-colors" placeholder="e.g. $100k - $130k / ₹15L - ₹20L" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#a7a7a7] uppercase tracking-wider mb-2">Job Description *</label>
                        <textarea required value={jobFormData.description} onChange={(e) => setJobFormData({...jobFormData, description: e.target.value})} className="w-full h-40 bg-[#181818] border border-[#242424] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#1ed760] resize-none transition-colors" placeholder="Describe the responsibilities, tech stack, and requirements... (This text will be used by the AI engine for TF-IDF vectorization!)" />
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-4 items-center pt-4 border-t border-[#242424]">
                        <button type="button" onClick={() => setIsJobModalOpen(false)} className="text-[#a7a7a7] hover:text-white font-bold text-sm px-4">Cancel</button>
                        <button type="submit" disabled={postingJob} className="bg-[#1ed760] text-black px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50">
                           {postingJob ? "Publishing..." : "Publish to Job Board"}
                        </button>
                    </div>
                </form>
             </div>
           </div>
        </div>
      )}

      {/* ------------------------------------------- */}
      {/* EMAIL MODAL                                 */}
      {/* ------------------------------------------- */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
           <div className="bg-[#121212] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#242424]">
             <div className="p-6 flex justify-between items-center border-b border-[#242424]">
                <h2 className="font-bold text-white text-xl">Automated Follow-Up</h2>
                <button onClick={() => {setSelectedCandidate(null); setGeneratedEmail('')}} className="text-[#a7a7a7] hover:text-white rounded-full p-2 hover:bg-[#242424] transition-colors"><X size={20}/></button>
             </div>
             <div className="p-6">
                {!generatedEmail ? (
                <div className="text-center py-10 space-y-6">
                    <p className="text-white text-lg font-bold">
                        Candidate moved to <span className={selectedCandidate.status === 'REJECTED' ? 'text-[#ef4444]' : 'text-[#1ed760]'}>{selectedCandidate.status}</span>.
                    </p>
                    <p className="text-[#a7a7a7] text-sm mb-6">Would you like to draft a notification email?</p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => handleGenerateEmail('interview')} className="bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform text-sm">Draft Interview Invite</button>
                        <button onClick={() => handleGenerateEmail('rejection')} className="bg-[#242424] text-white px-6 py-3 rounded-full font-bold hover:bg-[#2a2a2a] border border-[#333] transition-colors text-sm">Draft Rejection</button>
                    </div>
                </div>
                ) : (
                <div className="animate-fade-in">
                    <textarea 
                        className="w-full h-56 bg-[#181818] border border-[#242424] rounded-md p-4 text-sm text-[#a7a7a7] focus:text-white focus:outline-none focus:border-[#404040] resize-none transition-colors" 
                        value={generatedEmail} 
                        onChange={(e) => setGeneratedEmail(e.target.value)} 
                    />
                    <div className="mt-6 flex justify-end gap-4 items-center">
                        <button onClick={() => setGeneratedEmail('')} className="text-[#a7a7a7] hover:text-white font-bold text-sm px-4">Discard</button>
                        <button onClick={handleSendFinalEmail} className="bg-[#1ed760] text-black px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2">
                           {sending ? "Sending..." : <><Send size={16}/> Send Email</>}
                        </button>
                    </div>
                </div>
                )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;