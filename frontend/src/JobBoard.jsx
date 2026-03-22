import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, DollarSign, ArrowLeft, Upload, CheckCircle, Sparkles, Search, Clock, Building2, Briefcase } from 'lucide-react';

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: '', email: '', resume: null
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('import.meta.env.VITE_API_URL/api/jobs/');
        setJobs(response.data);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume || !formData.full_name || !formData.email) {
      alert("Please fill in required fields and upload a resume.");
      return;
    }

    setSubmitting(true);
    const submitData = new FormData();
    for (const key in formData) {
      submitData.append(key, formData[key]);
    }

    try {
      await axios.post(`import.meta.env.VITE_API_URL/api/apply/${selectedJob.id}/`, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Application failed", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-black text-white font-sans selection:bg-[#1ed760] selection:text-black min-h-[calc(100vh-80px)] pb-20">
      
      {/* VIEW 1: JOB LISTINGS */}
      {!selectedJob && !submitSuccess && (
        <div className="animate-fade-in">
          
          {/* Hero & Search Section */}
          <div className="bg-[#121212] border-b border-[#242424] pt-16 pb-12 px-6">
            <div className="max-w-[1200px] mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                Find your <span className="text-[#1ed760]">next adventure.</span>
              </h1>
              <p className="text-lg text-[#a7a7a7] mb-10 max-w-2xl mx-auto">
                Join our world-class engineering team. Discover open roles, apply in one click, and let our AI engine evaluate your true potential.
              </p>
              
              <div className="relative max-w-2xl mx-auto group">
                <Search className="absolute left-5 top-4 text-[#a7a7a7] group-hover:text-white transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder="Search for 'Frontend', 'Data Scientist', 'Remote'..." 
                  className="w-full bg-[#181818] border border-[#333] hover:border-[#404040] focus:border-[#1ed760] text-white text-base md:text-lg rounded-full py-4 pl-14 pr-6 outline-none transition-colors placeholder-[#a7a7a7] shadow-2xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="max-w-[1200px] mx-auto px-6 pt-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Open Positions</h2>
                <span className="text-[#a7a7a7] text-sm font-bold bg-[#181818] px-4 py-1.5 rounded-full border border-[#242424]">
                    {filteredJobs.length} roles found
                </span>
            </div>

            {loading ? (
              <div className="text-center py-20 text-[#a7a7a7] font-bold tracking-widest uppercase text-sm">Loading Career Portal...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.length === 0 ? (
                   <div className="col-span-full py-20 text-center text-[#a7a7a7] border-2 border-dashed border-[#242424] rounded-2xl">
                       No jobs found matching your search. Try different keywords.
                   </div>
                ) : filteredJobs.map(job => (
                  <div 
                    key={job.id} 
                    className="bg-[#121212] hover:bg-[#181818] p-8 rounded-2xl border border-[#242424] hover:border-[#1ed760]/50 transition-all group cursor-pointer flex flex-col h-full shadow-lg relative overflow-hidden"
                    onClick={() => setSelectedJob(job)}
                  >
                    {/* Subtle Top Border Glow on Hover */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1ed760] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="bg-[#181818] w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-[#2a2a2a] group-hover:bg-[#1ed760]/10 group-hover:border-[#1ed760]/30 transition-colors">
                        <Briefcase className="text-white group-hover:text-[#1ed760]" size={20}/>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#1ed760] transition-colors">{job.title}</h3>
                    
                    <div className="flex flex-col gap-2 text-sm text-[#a7a7a7] mb-6">
                      <span className="flex items-center gap-2"><MapPin size={16}/> {job.location || 'Remote'}</span>
                      <span className="flex items-center gap-2"><DollarSign size={16}/> {job.salary_range || 'Competitive Salary'}</span>
                      <span className="flex items-center gap-2"><Clock size={16}/> Full-Time</span>
                    </div>
                    
                    <p className="text-[#a7a7a7] text-sm line-clamp-3 mb-8 leading-relaxed flex-grow">
                      {job.description || "Join our team to work on cutting-edge technology. Apply now to have your profile contextually evaluated by our offline AI engine."}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-[#242424] flex justify-between items-center">
                        <span className="text-xs font-bold text-[#a7a7a7] uppercase tracking-wider">Apply Now</span>
                        <ArrowLeft size={18} className="text-[#1ed760] rotate-180 transform -translate-x-2 group-hover:translate-x-0 transition-transform opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: TWO-COLUMN APPLICATION VIEW */}
      {selectedJob && !submitSuccess && (
        <div className="max-w-[1200px] mx-auto px-6 pt-10 animate-fade-in">
          
          <button 
              onClick={() => setSelectedJob(null)}
              className="text-[#a7a7a7] hover:text-white flex items-center gap-2 text-sm font-bold mb-10 transition-colors w-fit"
          >
            <div className="bg-[#121212] p-2 rounded-full border border-[#242424] hover:bg-[#181818]">
                <ArrowLeft size={16}/>
            </div>
            Back to Job Board
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Job Description */}
              <div className="lg:col-span-7">
                  <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{selectedJob.title}</h1>
                  
                  <div className="flex flex-wrap gap-4 text-sm font-bold mb-10">
                      <div className="bg-[#121212] border border-[#242424] text-white px-4 py-2 rounded-full flex items-center gap-2">
                          <MapPin size={16} className="text-[#1ed760]"/> {selectedJob.location || 'Remote'}
                      </div>
                      <div className="bg-[#121212] border border-[#242424] text-white px-4 py-2 rounded-full flex items-center gap-2">
                          <Building2 size={16} className="text-[#1ed760]"/> Engineering
                      </div>
                      <div className="bg-[#121212] border border-[#242424] text-white px-4 py-2 rounded-full flex items-center gap-2">
                          <DollarSign size={16} className="text-[#1ed760]"/> {selectedJob.salary_range || 'Competitive'}
                      </div>
                  </div>

                  <div className="prose prose-invert max-w-none">
                      <h3 className="text-xl font-bold mb-4 text-white border-b border-[#242424] pb-2">About the Role</h3>
                      <p className="text-[#a7a7a7] leading-relaxed mb-8 whitespace-pre-wrap text-base">
                          {selectedJob.description || "We are looking for a highly skilled professional to join our team. \n\nAt NexusHire, we believe in removing bias from the hiring process. That is why we evaluate candidates based on architectural knowledge, system integrations, and problem-solving metrics, rather than purely looking for resume buzzwords.\n\nUpload your resume to let our AI Engine map your experience to our requirements."}
                      </p>

                      <h3 className="text-xl font-bold mb-4 text-white border-b border-[#242424] pb-2">Why join us?</h3>
                      <ul className="space-y-3 text-[#a7a7a7] mb-8 list-none pl-0">
                          <li className="flex items-center gap-3"><CheckCircle size={16} className="text-[#1ed760]"/> Remote-first culture with flexible hours</li>
                          <li className="flex items-center gap-3"><CheckCircle size={16} className="text-[#1ed760]"/> Comprehensive health, dental, and vision insurance</li>
                          <li className="flex items-center gap-3"><CheckCircle size={16} className="text-[#1ed760]"/> Annual learning and development stipend</li>
                      </ul>
                  </div>
              </div>

              {/* Right Column: Sticky Application Form */}
              <div className="lg:col-span-5 relative">
                  <div className="sticky top-28 bg-[#121212] p-8 rounded-2xl border border-[#242424] shadow-2xl">
                      <h3 className="text-2xl font-bold mb-6 text-white">Submit Application</h3>
                      
                      {/* AI Auto-Extraction Banner */}
                      <div className="bg-[#1ed760]/10 border border-[#1ed760]/20 rounded-xl p-4 flex gap-3 items-start mb-6">
                          <Sparkles className="text-[#1ed760] shrink-0 mt-0.5" size={18} />
                          <div>
                              <h4 className="text-[#1ed760] font-bold text-sm mb-1">Smart 1-Click Apply</h4>
                              <p className="text-[#a7a7a7] text-xs leading-relaxed">
                                  Just upload your PDF. Our Spatial Parsing Engine will automatically extract your contact details, GitHub, and LinkedIn links.
                              </p>
                          </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                          <div>
                              <label className="block text-xs font-bold text-[#a7a7a7] uppercase tracking-wider mb-2">Full Name *</label>
                              <input type="text" name="full_name" required onChange={handleInputChange} className="w-full bg-[#181818] border border-[#242424] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#1ed760] transition-colors" placeholder="Jane Doe" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-[#a7a7a7] uppercase tracking-wider mb-2">Email Address *</label>
                              <input type="email" name="email" required onChange={handleInputChange} className="w-full bg-[#181818] border border-[#242424] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#1ed760] transition-colors" placeholder="jane@example.com" />
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-[#a7a7a7] uppercase tracking-wider mb-2">Resume (PDF) *</label>
                              <div className="w-full bg-[#181818] border-2 border-[#242424] border-dashed rounded-xl p-8 text-center hover:bg-[#202020] hover:border-[#404040] transition-all cursor-pointer relative group">
                                  <input type="file" name="resume" accept=".pdf" required onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                  <div className="bg-[#242424] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                      <Upload className="text-[#a7a7a7] group-hover:text-white transition-colors" size={20}/>
                                  </div>
                                  <p className="text-sm text-white font-bold mb-1 truncate px-2">
                                      {formData.resume ? formData.resume.name : "Click or drag file to upload"}
                                  </p>
                                  <p className="text-xs text-[#a7a7a7]">PDF format up to 5MB</p>
                              </div>
                          </div>

                          <button type="submit" disabled={submitting} className="w-full bg-[#1ed760] text-black font-extrabold text-sm py-4 rounded-xl hover:bg-[#1fdf64] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(30,215,96,0.2)] hover:shadow-[0_0_30px_rgba(30,215,96,0.4)] mt-4">
                              {submitting ? "Engine Analyzing Profile..." : "Submit to AI Engine"}
                          </button>
                      </form>
                  </div>
              </div>

          </div>
        </div>
      )}

      {/* VIEW 3: SUCCESS STATE */}
      {submitSuccess && (
        <div className="max-w-xl mx-auto text-center py-32 animate-fade-in px-6">
          <div className="w-24 h-24 bg-[#1ed760]/10 border border-[#1ed760]/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(30,215,96,0.1)]">
              <CheckCircle size={48} className="text-[#1ed760]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Application Successfully Intercepted</h2>
          <p className="text-[#a7a7a7] text-lg mb-10 leading-relaxed">
            Your resume is currently being parsed, vectorized, and triangulated by our offline Context Engine. You will hear back from us shortly.
          </p>
          <button 
            onClick={() => {setSubmitSuccess(false); setSelectedJob(null);}} 
            className="bg-white text-black font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
          >
            Browse More Opportunities
          </button>
        </div>
      )}

    </div>
  );
}

export default JobBoard;