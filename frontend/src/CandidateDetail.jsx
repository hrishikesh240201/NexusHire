import React from 'react';
import { 
    ArrowLeft, FileText, Brain, Code2, Briefcase, 
    MessageSquare, Globe, ExternalLink, ShieldCheck, Github
} from 'lucide-react';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip 
} from 'recharts';

function CandidateDetail({ candidate, onBack }) {
  if (!candidate) return null;

  const analysis = candidate.ai_analysis || {};
  const breakdown = analysis.breakdown || {};
  
  // Convert raw scores to percentages (0-100) so the Radar Chart stays visually balanced!
  const getPercent = (score, max) => Math.round(((score || 0) / max) * 100);

  // Format data for the Radar Chart using the new 6-pillar breakdown
  const radarData = [
    { subject: 'Tech Match', score: getPercent(breakdown.technical_match, 20) },
    { subject: 'Problem Solving', score: getPercent(breakdown.problem_solving, 25) },
    { subject: 'Practical Exp.', score: getPercent(breakdown.practical_experience, 15) },
    { subject: 'GitHub Activity', score: getPercent(breakdown.github_consistency, 15) },
    { subject: 'Soft Skills', score: getPercent(breakdown.soft_skills, 15) },
    { subject: 'Professionalism', score: getPercent(breakdown.professionalism, 10) },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white p-4 md:p-8 font-sans animate-fade-in selection:bg-[#1ed760] selection:text-black pb-20">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Navigation & Header */}
        <button 
          onClick={onBack}
          className="text-[#a7a7a7] hover:text-white flex items-center gap-2 text-sm font-bold mb-8 transition-colors group w-fit"
        >
          <div className="bg-[#242424] p-2 rounded-full group-hover:bg-[#333] transition-colors border border-[#333]">
            <ArrowLeft size={16}/>
          </div>
          Back to Pipeline
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">{candidate.full_name}</h1>
                <p className="text-[#a7a7a7] flex items-center gap-2">
                    {candidate.email} • Applied for <span className="font-bold text-white">{candidate.job?.title || 'Open Role'}</span>
                </p>
            </div>
            <div className="bg-[#242424] text-white px-5 py-2.5 rounded-full text-sm font-bold tracking-widest uppercase border border-[#333] shadow-lg">
                Status: <span className={candidate.status === 'REJECTED' ? 'text-[#ef4444]' : 'text-[#1ed760]'}>{candidate.status || 'APPLIED'}</span>
            </div>
        </div>

        {/* Top Grid: Main Score & Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* HERO CARD: Career Readiness Score */}
            <div className="lg:col-span-2 bg-[#121212] rounded-2xl p-8 border border-[#242424] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl">
                {/* Subtle green glow effect in the background */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#1ed760] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

                <div className="flex-1 relative z-10">
                    <h2 className="text-xs font-bold text-[#a7a7a7] uppercase tracking-widest mb-4">Career Readiness Score</h2>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className={`text-8xl font-black leading-none ${analysis.crs_score >= 75 ? 'text-[#1ed760]' : 'text-white'}`}>
                            {analysis.crs_score || 0}
                        </span>
                        <span className="text-2xl font-bold text-[#a7a7a7]">/100</span>
                    </div>
                    <p className="text-sm text-[#a7a7a7] leading-relaxed max-w-md">
                        {analysis.summary_flag === 'Excellent Fit' 
                            ? "Candidate is a top-tier match based on 6-point architectural and behavioral analysis." 
                            : "Candidate scored below the top-tier threshold. Manual review recommended."}
                    </p>
                </div>

                <div className="w-full md:w-[350px] h-[300px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                            <PolarGrid stroke="#333" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#a7a7a7', fontSize: 11, fontWeight: 'bold' }} />
                            <Tooltip 
                                formatter={(value) => [`${value}%`, 'Score Match']}
                                contentStyle={{ backgroundColor: '#181818', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#1ed760', fontWeight: 'bold' }}
                            />
                            <Radar name="Candidate" dataKey="score" stroke="#1ed760" fill="#1ed760" fillOpacity={0.4} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* SIDE COLUMN: Links & Original Resume */}
            <div className="space-y-6 flex flex-col justify-between">
                <div className="bg-[#121212] rounded-2xl p-6 border border-[#242424] shadow-xl">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
                        <Globe size={18} className="text-[#1ed760]" /> Professional Footprint
                    </h3>
                    
                    <div className="space-y-3">
                        {candidate.linkedin_link ? (
                            <a href={candidate.linkedin_link} target="_blank" rel="noreferrer" className="flex items-center justify-between bg-[#181818] hover:bg-[#242424] p-3 rounded-xl border border-[#2a2a2a] transition-colors group">
                                <span className="text-sm text-[#a7a7a7] group-hover:text-white font-medium">LinkedIn Profile</span>
                                <ExternalLink size={14} className="text-[#a7a7a7] group-hover:text-[#1ed760] transition-colors" />
                            </a>
                        ) : (
                            <div className="flex items-center justify-between bg-[#181818] p-3 rounded-xl border border-[#2a2a2a] opacity-50">
                                <span className="text-sm text-[#a7a7a7]">LinkedIn Profile</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#a7a7a7] bg-[#242424] px-2 py-1 rounded-md">Missing</span>
                            </div>
                        )}

                        {candidate.github_link ? (
                            <a href={candidate.github_link} target="_blank" rel="noreferrer" className="flex items-center justify-between bg-[#181818] hover:bg-[#242424] p-3 rounded-xl border border-[#2a2a2a] transition-colors group">
                                <span className="text-sm text-[#a7a7a7] group-hover:text-white font-medium">GitHub Repository</span>
                                <ExternalLink size={14} className="text-[#a7a7a7] group-hover:text-[#1ed760] transition-colors" />
                            </a>
                        ) : (
                            <div className="flex items-center justify-between bg-[#181818] p-3 rounded-xl border border-[#2a2a2a] opacity-50">
                                <span className="text-sm text-[#a7a7a7]">GitHub Repository</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#a7a7a7] bg-[#242424] px-2 py-1 rounded-md">Missing</span>
                            </div>
                        )}
                        
                        {candidate.portfolio_link && (
                             <a href={candidate.portfolio_link} target="_blank" rel="noreferrer" className="flex items-center justify-between bg-[#181818] hover:bg-[#242424] p-3 rounded-xl border border-[#2a2a2a] transition-colors group">
                             <span className="text-sm text-[#a7a7a7] group-hover:text-white font-medium">Portfolio URL</span>
                             <ExternalLink size={14} className="text-[#a7a7a7] group-hover:text-[#1ed760] transition-colors" />
                         </a>
                        )}
                    </div>
                </div>

                <div className="bg-[#121212] rounded-2xl p-6 border border-[#242424] shadow-xl h-full flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-white mb-2">Original Document</h3>
                    <p className="text-xs text-[#a7a7a7] mb-6">View the raw PDF submitted by the candidate before AI extraction.</p>
                    
                    {candidate.resume_file ? (
                        <a 
                            href={`http://127.0.0.1:8000${candidate.resume_file}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full bg-white text-black font-extrabold text-sm px-4 py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            <FileText size={18}/> View PDF Document
                        </a>
                    ) : (
                         <button disabled className="w-full bg-[#242424] text-[#a7a7a7] font-bold text-sm px-4 py-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-[#333]">
                            <FileText size={18}/> No Document Found
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Bottom Grid: The 6 Core Parameter Cards */}
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 mt-4">
            Engine Breakdown <span className="bg-[#242424] border border-[#333] text-[#a7a7a7] text-[10px] px-2 py-1 rounded-md uppercase tracking-widest ml-2">6-Point Analysis</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* 1. Technical Match */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-[#242424] hover:border-[#404040] transition-colors group shadow-lg">
                <div className="flex items-start justify-between mb-8">
                    <div className="bg-[#181818] p-3 rounded-xl border border-[#2a2a2a] group-hover:text-[#1ed760] transition-colors">
                        <Code2 size={24}/>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-white">{breakdown.technical_match || 0}</span>
                        <span className="text-xs font-bold text-[#a7a7a7]"> / 20</span>
                    </div>
                </div>
                <h4 className="font-bold text-white mb-1">Technical Match</h4>
                <p className="text-xs text-[#a7a7a7]">Local TF-IDF Vectorization against Job Description.</p>
            </div>

            {/* 2. Problem Solving */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-[#242424] hover:border-[#404040] transition-colors group shadow-lg">
                <div className="flex items-start justify-between mb-8">
                    <div className="bg-[#181818] p-3 rounded-xl border border-[#2a2a2a] group-hover:text-[#1ed760] transition-colors">
                        <Brain size={24}/>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-white">{breakdown.problem_solving || 0}</span>
                        <span className="text-xs font-bold text-[#a7a7a7]"> / 25</span>
                    </div>
                </div>
                <h4 className="font-bold text-white mb-1">Problem Solving</h4>
                <p className="text-xs text-[#a7a7a7]">Triangulation of architecture, layers, and metrics.</p>
            </div>

            {/* 3. Practical Experience */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-[#242424] hover:border-[#404040] transition-colors group shadow-lg">
                <div className="flex items-start justify-between mb-8">
                    <div className="bg-[#181818] p-3 rounded-xl border border-[#2a2a2a] group-hover:text-[#1ed760] transition-colors">
                        <Briefcase size={24}/>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-white">{breakdown.practical_experience || 0}</span>
                        <span className="text-xs font-bold text-[#a7a7a7]"> / 15</span>
                    </div>
                </div>
                <h4 className="font-bold text-white mb-1">Practical Exp.</h4>
                <p className="text-xs text-[#a7a7a7]">Targeted scanning restricted to the Experience block.</p>
            </div>

            {/* 4. GitHub Consistency */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-[#242424] hover:border-[#404040] transition-colors group shadow-lg">
                <div className="flex items-start justify-between mb-8">
                    <div className="bg-[#181818] p-3 rounded-xl border border-[#2a2a2a] group-hover:text-[#1ed760] transition-colors">
                        <Github size={24}/>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-white">{breakdown.github_consistency || 0}</span>
                        <span className="text-xs font-bold text-[#a7a7a7]"> / 15</span>
                    </div>
                </div>
                <h4 className="font-bold text-white mb-1">GitHub Consistency</h4>
                <p className="text-xs text-[#a7a7a7]">Real-time API evaluation of push events and commit density.</p>
            </div>

            {/* 5. Soft Skills */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-[#242424] hover:border-[#404040] transition-colors group shadow-lg">
                <div className="flex items-start justify-between mb-8">
                    <div className="bg-[#181818] p-3 rounded-xl border border-[#2a2a2a] group-hover:text-[#1ed760] transition-colors">
                        <MessageSquare size={24}/>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-white">{breakdown.soft_skills || 0}</span>
                        <span className="text-xs font-bold text-[#a7a7a7]"> / 15</span>
                    </div>
                </div>
                <h4 className="font-bold text-white mb-1">Soft Skills & NLP</h4>
                <p className="text-xs text-[#a7a7a7]">TextBlob Sentiment Analysis and Flesch-Kincaid scoring.</p>
            </div>

            {/* 6. Professionalism */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-[#242424] hover:border-[#404040] transition-colors group shadow-lg">
                <div className="flex items-start justify-between mb-8">
                    <div className="bg-[#181818] p-3 rounded-xl border border-[#2a2a2a] group-hover:text-[#1ed760] transition-colors">
                        <ShieldCheck size={24}/>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-white">{breakdown.professionalism || 0}</span>
                        <span className="text-xs font-bold text-[#a7a7a7]"> / 10</span>
                    </div>
                </div>
                <h4 className="font-bold text-white mb-1">Professionalism</h4>
                <p className="text-xs text-[#a7a7a7]">Evaluates document structure, length, and contact clarity.</p>
            </div>

        </div>

      </div>
    </div>
  );
}

export default CandidateDetail;