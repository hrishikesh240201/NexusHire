import { Link } from 'react-router-dom';
import { FileText, Globe, ArrowRight, ShieldCheck, Database, GitBranch, Zap, CheckCircle2 } from 'lucide-react';

function LandingPage() {
  return (
    <div className="bg-black text-white font-sans selection:bg-[#1ed760] selection:text-black">
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#1ed760] blur-[150px] rounded-full opacity-10 pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-6 py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121212] border border-[#242424] text-[#a7a7a7] text-xs font-bold mb-8 uppercase tracking-widest shadow-lg">
            <ShieldCheck size={14} className="text-[#1ed760]" /> Enterprise V3.0 • Offline Context Engine
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Beyond Keyword Matching.<br/>
            <span className="text-[#1ed760]">
              True Contextual Analysis.
            </span>
          </h1>
          <p className="text-lg text-[#a7a7a7] max-w-2xl mx-auto mb-12 leading-relaxed">
            Legacy Applicant Tracking Systems reject brilliant engineers over formatting errors. NexusHire uses spatial document parsing, TF-IDF vectorization, and offline architecture triangulation to evaluate talent like a Senior Engineering Manager.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/jobs" className="flex items-center justify-center gap-2 bg-[#1ed760] hover:bg-[#1fdf64] text-black px-8 py-4 rounded-full font-bold text-sm transition-transform hover:scale-105 shadow-[0_0_20px_rgba(30,215,96,0.2)]">
              Experience the Platform <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS: THE NEW ARCHITECTURE */}
      <div className="bg-[#121212] border-y border-[#242424] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-3xl font-extrabold mb-4">The Next-Gen Evaluation Engine</h2>
            <p className="text-[#a7a7a7]">How we completely eliminated the "Buzzword Cheat" and API rate limits.</p>
          </div>

          <div className="space-y-32">
            
            {/* Feature 1: Spatial Parsing & TF-IDF */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 text-[#1ed760] mb-4 font-bold tracking-wider uppercase text-xs">
                  <Database size={16} /> Spatial Parsing
                </div>
                <h3 className="text-3xl font-bold mb-6">Multi-Column Resume Immunity</h3>
                <p className="text-[#a7a7a7] text-base leading-relaxed mb-6">
                  Traditional ATS parsers read straight across the page, scrambling modern two-column resumes and creating false data. Our backend uses `pdfplumber` to map the exact (X, Y) pixel coordinates of the document, perfectly segmenting Education, Experience, and Skills blocks before analysis.
                </p>
                <ul className="space-y-4 text-sm font-medium text-white">
                  <li className="flex gap-3 items-center"><CheckCircle2 size={18} className="text-[#1ed760] shrink-0"/> Zero false-positive keyword triggers.</li>
                  <li className="flex gap-3 items-center"><CheckCircle2 size={18} className="text-[#1ed760] shrink-0"/> Scikit-Learn TF-IDF vectorization matching.</li>
                </ul>
              </div>
              
              {/* CSS UI Mockup */}
              <div className="bg-[#181818] rounded-xl border border-[#242424] p-6 font-mono text-sm relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1ed760] to-transparent opacity-50"></div>
                <div className="text-[#a7a7a7] mb-2">// Raw Layout Extraction</div>
                <div className="text-emerald-400 mb-4">{`{`}</div>
                <div className="pl-4 space-y-2">
                    <div className="text-blue-400">"header"<span className="text-white">:</span> <span className="text-yellow-300">"Tanvi Kachi | Computer Engineer"</span>,</div>
                    <div className="text-blue-400">"experience"<span className="text-white">:</span> <span className="text-yellow-300">""</span>, <span className="text-[#a7a7a7] ml-2">// Accurately mapped as empty</span></div>
                    <div className="text-blue-400">"education"<span className="text-white">:</span> <span className="text-yellow-300">"Diploma in Computer Engineering"</span></div>
                </div>
                <div className="text-emerald-400 mt-4">{`}`}</div>
              </div>
            </div>

            {/* Feature 2: Architecture Triangulation */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* CSS UI Mockup */}
              <div className="bg-[#181818] rounded-xl border border-[#242424] p-6 relative order-2 lg:order-1 flex flex-col justify-center shadow-2xl">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between bg-[#121212] border border-[#1ed760]/30 p-4 rounded-lg">
                        <span className="text-white font-bold text-sm">Tech Stack Layers</span>
                        <span className="text-[#1ed760] text-xs font-mono">React + Django + PostgreSQL</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#121212] border border-[#1ed760]/30 p-4 rounded-lg">
                        <span className="text-white font-bold text-sm">System Integrations</span>
                        <span className="text-[#1ed760] text-xs font-mono">REST API Detected</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#121212] border border-[#1ed760]/30 p-4 rounded-lg">
                        <span className="text-white font-bold text-sm">Quantifiable Metrics</span>
                        <span className="text-[#1ed760] text-xs font-mono">"reduced latency by 20%"</span>
                    </div>
                 </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-3 text-[#1ed760] mb-4 font-bold tracking-wider uppercase text-xs">
                  <GitBranch size={16} /> Triangulation Engine
                </div>
                <h3 className="text-3xl font-bold mb-6">Defeating the "Buzzword Cheat"</h3>
                <p className="text-[#a7a7a7] text-base leading-relaxed mb-6">
                  Legacy systems reward candidates for blindly stuffing keywords like "Architected" or "Scalable" into their resume. Our offline Python engine demands proof. We mathematically cross-reference multi-layer tech stacks with system integrations and hard engineering metrics to calculate genuine problem-solving complexity.
                </p>
                <ul className="space-y-4 text-sm font-medium text-white">
                  <li className="flex gap-3 items-center"><FileText className="text-[#1ed760] shrink-0"/> Flesch-Kincaid Readability scoring.</li>
                  <li className="flex gap-3 items-center"><Zap className="text-[#1ed760] shrink-0"/> Offline NLP Sentiment Analysis.</li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Enterprise Integrations */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 text-[#1ed760] mb-4 font-bold tracking-wider uppercase text-xs">
                  <Globe size={16} /> Open Web Integration
                </div>
                <h3 className="text-3xl font-bold mb-6">XML Syndication & Linear Pipelines</h3>
                <p className="text-[#a7a7a7] text-base leading-relaxed mb-6">
                  NexusHire is built to enterprise standards. Instead of clunky drag-and-drop boards, recruiters manage talent using an optimized inline stepper pipeline with automated email triggers. Furthermore, the platform automatically generates live XML Syndication feeds, allowing seamless integration with external job boards.
                </p>
              </div>

              {/* CSS UI Mockup: The Pipeline Stepper */}
              <div className="bg-[#181818] rounded-xl border border-[#242424] p-12 relative flex items-center justify-center shadow-2xl">
                 <div className="flex items-center w-full max-w-[300px] justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#242424] -z-10 -translate-y-1/2"></div>
                    
                    <div className="flex flex-col items-center gap-3 bg-[#181818] px-2 z-10">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1ed760] text-black"><CheckCircle2 size={18}/></div>
                        <span className="text-[10px] font-bold text-[#a7a7a7] uppercase tracking-wider">Applied</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 bg-[#181818] px-2 z-10">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#1ed760] text-[#1ed760] shadow-[0_0_15px_rgba(30,215,96,0.3)] text-sm font-bold scale-110">2</div>
                        <span className="text-[10px] font-bold text-[#1ed760] uppercase tracking-wider">Interview</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 bg-[#181818] px-2 z-10">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#404040] text-[#a7a7a7] text-sm font-bold">3</div>
                        <span className="text-[10px] font-bold text-[#a7a7a7] uppercase tracking-wider">Offer</span>
                    </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#242424] bg-black py-12 text-center text-[#a7a7a7] text-sm font-medium">
        <p>Architected for modern HR • Powered by Django, Scikit-Learn, and React</p>
      </footer>

    </div>
  );
}

export default LandingPage;