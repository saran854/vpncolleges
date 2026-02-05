
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ApplicationForm from "./components/ApplicationForm";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import AICounselor from "./components/AICounselor";
import { ViewState, ApplicationData, ApplicationStatus } from "./types";
import { COURSES } from "./constants";

const App = () => {
  const [view, setView] = useState<ViewState>("HOME");
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [trackId, setTrackId] = useState("");
  const [searchedApp, setSearchedApp] = useState<ApplicationData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vpn_applications");
    if (saved) {
      setApplications(JSON.parse(saved));
    } else {
      const mockData: ApplicationData[] = [
        {
          id: 'APP-VPN2024A',
          fullName: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '123-456-7890',
          dob: '2005-05-15',
          gender: 'Female',
          address: '123 Maple St',
          courseId: 'CSE-001',
          prevSchool: 'Liberty High',
          percentage: 95.5,
          status: ApplicationStatus.APPROVED,
          submittedAt: new Date().toISOString()
        },
        {
          id: 'APP-VPN2024B',
          fullName: 'Robert Smith',
          email: 'bob@gmail.com',
          phone: '987-654-3210',
          dob: '2004-11-20',
          gender: 'Male',
          address: '456 Oak Rd',
          courseId: 'IT-001',
          prevSchool: 'North Side Secondary',
          percentage: 82.0,
          status: ApplicationStatus.UNDER_REVIEW,
          submittedAt: new Date().toISOString()
        }
      ];
      setApplications(mockData);
      localStorage.setItem('vpn_applications', JSON.stringify(mockData));
    }
  }, []);

  const handleApplicationSubmit = (data: ApplicationData) => {
    const updated = [data, ...applications];
    setApplications(updated);
    localStorage.setItem('vpn_applications', JSON.stringify(updated));
    setTrackId(data.id);
    setView('STATUS');
    setSearchedApp(data);
    setHasSearched(true);
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus) => {
    const updated = applications.map(app => app.id === id ? { ...app, status } : app);
    setApplications(updated);
    localStorage.setItem('vpn_applications', JSON.stringify(updated));
    if (searchedApp && searchedApp.id === id) {
      setSearchedApp({ ...searchedApp, status });
    }
  };

  const handleTrack = () => {
    if (!trackId.trim()) return;
    const found = applications.find(a => a.id.toUpperCase() === trackId.toUpperCase());
    setSearchedApp(found || null);
    setHasSearched(true);
  };

  const handleAdminAuth = (success: boolean) => {
    if (success) {
      setIsAdminAuthenticated(true);
      setView('ADMIN');
    }
  };

  const getStatusStep = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.SUBMITTED: return 1;
      case ApplicationStatus.UNDER_REVIEW: return 2;
      case ApplicationStatus.APPROVED:
      case ApplicationStatus.REJECTED: return 3;
      default: return 0;
    }
  };

  const handleViewChange = (newView: ViewState) => {
    if (newView === 'ADMIN' && !isAdminAuthenticated) {
      setView('ADMIN_LOGIN');
    } else {
      setView(newView);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
      <Header currentView={view} setView={handleViewChange} />
      
      <main className="flex-1">
        {view === 'HOME' && (
          <div className="animate-in fade-in duration-1000">
            <Hero onApply={() => handleViewChange('APPLY')} onExplore={() => handleViewChange('COURSES')} />
            
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
              <div className="text-center mb-20">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">The VPN Advantage</span>
                <h2 className="text-5xl font-extrabold font-serif text-slate-900 dark:text-white mt-4 transition-colors">Engineering Excellence.</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-10">
                {[
                  { title: "Smart Labs", desc: "Equipped with the latest IoT, Robotics, and AI infrastructure for hands-on learning.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                  { title: "Global Research", desc: "Collaborate with international universities on cutting-edge technological papers.", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                  { title: "Placement Cell", desc: "Exclusive partnerships with over 200+ global tech giants for campus hiring.", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }
                ].map((item, i) => (
                  <div key={i} className="group bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-600/5 dark:hover:shadow-blue-900/40 transition-all duration-500 hover:-translate-y-2">
                    <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-blue-600 transition-colors duration-500">
                      <svg className="w-10 h-10 text-slate-900 dark:text-slate-100 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 transition-colors">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {view === 'APPLY' && (
          <div className="px-4 py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="max-w-7xl mx-auto">
               <div className="text-center mb-16">
                  <h2 className="text-5xl font-extrabold font-serif text-slate-900 dark:text-white transition-colors">Start Your Application.</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium">Embark on a journey of innovation and engineering mastery.</p>
               </div>
               <ApplicationForm onSubmit={handleApplicationSubmit} />
             </div>
          </div>
        )}

        {view === 'COURSES' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 animate-in fade-in duration-700">
             <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
                <div className="max-w-2xl">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">The Curriculum</span>
                  <h2 className="text-6xl font-extrabold font-serif text-slate-900 dark:text-white mt-4 leading-tight transition-colors">Engineering the Future.</h2>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-lg max-w-sm mb-2 font-medium">
                   Our B.E. and B.Tech programs are designed by industry veterans to meet the demands of a rapidly evolving global tech landscape.
                </div>
             </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
               {COURSES.map(course => (
                 <div key={course.id} className="group bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-500 flex flex-col hover:shadow-2xl hover:shadow-blue-600/10 dark:hover:shadow-blue-900/40">
                    <div className="h-56 relative overflow-hidden">
                       <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                       <div className="absolute bottom-4 left-6 text-white">
                          <div className="text-xs font-black uppercase tracking-widest text-blue-400">{course.department}</div>
                          <div className="text-lg font-bold">{course.duration}</div>
                       </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{course.name}</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-8 flex-1 font-medium leading-relaxed">{course.description}</p>
                      <button 
                        onClick={() => handleViewChange('APPLY')}
                        className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                      >
                        Enroll Now
                      </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {view === 'STATUS' && (
          <div className="max-w-5xl mx-auto px-4 py-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white dark:bg-slate-900 p-12 md:p-16 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-50 dark:border-slate-800 relative overflow-hidden transition-colors">
               <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 dark:bg-blue-500"></div>
               <div className="relative z-10">
                 <h2 className="text-5xl font-extrabold font-serif text-slate-900 dark:text-white mb-4 tracking-tight transition-colors text-center md:text-left">Track Progress.</h2>
                 <p className="text-slate-500 dark:text-slate-400 mb-12 text-lg font-medium text-center md:text-left">Use your Application Reference ID to check your live admission status.</p>
                 
                 <div className="flex flex-col sm:flex-row gap-4 mb-16">
                    <input 
                      type="text" 
                      value={trackId}
                      onChange={(e) => {
                        setTrackId(e.target.value);
                        setHasSearched(false);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                      placeholder="e.g. APP-VPN2024A"
                      className="flex-1 px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none uppercase font-black text-slate-900 dark:text-white transition-all text-xl tracking-tight"
                    />
                    <button 
                      onClick={handleTrack}
                      className="px-12 py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-slate-900/20 dark:shadow-blue-600/30 hover:bg-blue-600 dark:hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      Search
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                 </div>

                 {hasSearched && !searchedApp && (
                   <div className="bg-red-50 dark:bg-red-900/10 p-10 rounded-[3rem] text-center border border-red-100 dark:border-red-900/20 animate-in zoom-in-95 duration-300">
                      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Record Not Found</h3>
                      <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">The Application ID "<span className="font-bold text-red-600 uppercase">{trackId}</span>" does not match any records in our database.</p>
                   </div>
                 )}

                 {searchedApp && (
                   <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-8">
                      <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                        </div>
                        <div className="relative z-10">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                            <div>
                               <div className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] mb-2">Verified Enrollment Account</div>
                               <div className="text-4xl font-extrabold tracking-tight">{searchedApp.fullName}</div>
                               <div className="text-sm font-bold text-slate-500 mt-1">{searchedApp.email} • Application ID: <span className="text-blue-400">{searchedApp.id}</span></div>
                            </div>
                            <div className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl ${
                              searchedApp.status === ApplicationStatus.APPROVED ? 'bg-green-500 shadow-green-500/20' :
                              searchedApp.status === ApplicationStatus.REJECTED ? 'bg-red-500 shadow-red-500/20' :
                              'bg-blue-600 shadow-blue-500/30'
                            }`}>
                              {searchedApp.status}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Target Major</div>
                              <div className="text-lg font-bold text-slate-100">{COURSES.find(c => c.id === searchedApp.courseId)?.name}</div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Entrance Score</div>
                              <div className="text-lg font-bold text-slate-100">{searchedApp.entranceScore || 'Under Review'}</div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Submission Date</div>
                              <div className="text-lg font-bold text-slate-100">{new Date(searchedApp.submittedAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">Lifecycle Timeline</h4>
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-8">
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700 -translate-y-1/2 z-0"></div>
                            
                            {[
                              { step: 1, label: 'Submitted', desc: 'Received by Admissions Desk' },
                              { step: 2, label: 'In Verification', desc: 'Academic records review' },
                              { step: 3, label: 'Final Decision', desc: 'Seat allocation result' }
                            ].map((s) => {
                              const activeStep = getStatusStep(searchedApp.status);
                              const isCompleted = activeStep >= s.step;
                              const isRejected = s.step === 3 && searchedApp.status === ApplicationStatus.REJECTED;
                              const isApproved = s.step === 3 && searchedApp.status === ApplicationStatus.APPROVED;

                              return (
                                <div key={s.step} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-0 flex-1 group">
                                  <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-xl ${
                                    isRejected ? 'bg-red-500 text-white' :
                                    isApproved ? 'bg-green-500 text-white' :
                                    isCompleted ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                                  }`}>
                                    {isCompleted && s.step < 3 ? (
                                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                      <span className="text-xl font-black">{s.step}</span>
                                    )}
                                  </div>
                                  <div className="md:mt-6 text-left md:text-center">
                                    <div className={`text-sm font-black transition-colors ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{s.label}</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{s.desc}</div>
                                  </div>
                                </div>
                              );
                            })}
                         </div>

                         <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                               {searchedApp.status === ApplicationStatus.SUBMITTED && "Your application is securely stored in our system. The automation layer is performing preliminary document cross-verification."}
                               {searchedApp.status === ApplicationStatus.UNDER_REVIEW && "The Academic Senate is currently reviewing your merit scores and statement of purpose. Expected turnaround: 24-48 hours."}
                               {searchedApp.status === ApplicationStatus.APPROVED && "Congratulations! You have been provisionally selected for the program. An official offer letter with payment instructions has been dispatched to your email."}
                               {searchedApp.status === ApplicationStatus.REJECTED && "We regret to inform you that your application does not meet the current merit threshold for the selected engineering program."}
                            </p>
                         </div>
                      </div>
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}

        {view === 'ADMIN_LOGIN' && (
          <AdminLogin 
            onLogin={handleAdminAuth} 
            onCancel={() => handleViewChange('HOME')} 
          />
        )}

        {view === 'ADMIN' && isAdminAuthenticated && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
               <div>
                  <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">Admin Console</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Command center for institutional admissions.</p>
               </div>
               <button 
                onClick={() => {
                  setIsAdminAuthenticated(false);
                  handleViewChange('HOME');
                }}
                className="px-8 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest transition-all"
               >
                 Sign Out
               </button>
            </div>
            <AdminDashboard 
              applications={applications} 
              onUpdateStatus={updateApplicationStatus} 
            />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-24 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-16">
            <div className="col-span-2">
              <div className="flex items-center mb-8">
                <div className="bg-blue-600 p-2.5 rounded-xl mr-4 transform hover:rotate-12 transition-transform">
                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                   </svg>
                </div>
                <span className="text-3xl font-extrabold font-serif tracking-tight">V.P.N Engineering</span>
              </div>
              <p className="text-slate-400 max-w-sm mb-10 text-lg leading-relaxed font-medium">
                Pioneering innovation and technological excellence since 1995. Accredited with A+ Grade globally.
              </p>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-10 text-blue-500 dark:text-blue-400">Navigation</h4>
              <ul className="space-y-6 text-slate-300 dark:text-slate-400 font-bold text-sm">
                <li><button onClick={() => handleViewChange('HOME')} className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Campus Home</button></li>
                <li><button onClick={() => handleViewChange('COURSES')} className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Our Curriculum</button></li>
                <li><button onClick={() => handleViewChange('APPLY')} className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Enrollment</button></li>
                <li><button onClick={() => handleViewChange('STATUS')} className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Track Application</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-10 text-blue-500 dark:text-blue-400">Admissions</h4>
              <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed mb-6 font-medium">Academic Block A,<br/>V.P.N Campus, Engineering Sq.</p>
              <p className="text-white font-black text-sm mb-2 underline decoration-blue-600 decoration-2 underline-offset-4">apply@vpnengg.edu</p>
              <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">+91 (22) 2450 6789</p>
            </div>
          </div>
          <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-[10px] font-black uppercase tracking-widest transition-colors">
            <div>© 2024 V.P.N Engineering & Technology Academic Senate.</div>
            <div className="flex gap-8">
               <a href="#" className="hover:text-white transition-colors">Privacy Charter</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Conduct</a>
            </div>
          </div>
        </div>
      </footer>

      <AICounselor />
    </div>
  );
};

export default App;
