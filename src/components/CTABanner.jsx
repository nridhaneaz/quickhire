import { Link } from 'react-router-dom';

export default function CTABanner() {

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden"
          style={{ background: '#4640DE', clipPath: 'polygon(4% 0%, 100% 0%, 96% 100%, 0% 100%)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center px-12 md:px-20 py-14 gap-8">

            {/* Left Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Start posting<br />jobs today
              </h2>
              <p className="text-white/70 mt-5 text-base md:text-lg">
                Start posting jobs for only $10.
              </p>
              <Link
                to="/signup"
                className="inline-block mt-8 border-2 border-white text-white font-bold text-base px-8 py-3 hover:bg-white hover:text-[#4640DE] transition-colors"
              >
                Sign Up For Free
              </Link>
            </div>

            {/* Right Dashboard Mockup */}
            <div className="hidden lg:flex justify-end items-end relative">
              <div
                className="bg-white rounded-tl-2xl rounded-tr-2xl overflow-hidden shadow-2xl w-full max-w-[600px]"
                style={{ marginBottom: '-56px' }}
              >
                {/* Dashboard Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#4640DE] rounded-full flex items-center justify-center">
                      <span className="text-white text-[9px] font-bold">Q</span>
                    </div>
                    <span className="text-[#25324B] font-bold text-sm">QuickHire</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">N</span>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 leading-none">Company</p>
                        <p className="text-[10px] font-semibold text-[#25324B]">Nomad ∨</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <button className="bg-[#4640DE] text-white text-[10px] font-semibold px-3 py-1.5 rounded flex items-center gap-1">
                      + Post a Job
                    </button>
                  </div>
                </div>

                <div className="flex">
                  {/* Sidebar */}
                  <div className="w-40 border-r border-gray-100 py-4 px-3 shrink-0">
                    {[
                      { label: 'Dashboard', active: true },
                      { label: 'Messages', badge: '1' },
                      { label: 'Company Profile' },
                      { label: 'All Applicants' },
                      { label: 'Job Listing' },
                      { label: 'My Schedule' },
                    ].map(({ label, active, badge }) => (
                      <div
                        key={label}
                        className={`flex items-center justify-between px-2 py-1.5 rounded text-[10px] mb-0.5 cursor-pointer ${
                          active ? 'bg-[#F0EFFF] text-[#4640DE] font-semibold' : 'text-gray-500'
                        }`}
                      >
                        <span>{label}</span>
                        {badge && (
                          <span className="bg-[#FF6550] text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">{badge}</span>
                        )}
                      </div>
                    ))}
                    <div className="mt-5 px-2">
                      <p className="text-[8px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Settings</p>
                      {['Settings', 'Help Center'].map((item) => (
                        <div key={item} className="text-[10px] text-gray-500 py-1.5 px-2 rounded cursor-pointer">{item}</div>
                      ))}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-[#25324B]">Good morning, Maria</h3>
                        <p className="text-[9px] text-gray-400">Here is your job listings statistic report from July 19 – Jul 25.</p>
                      </div>
                      <span className="text-[9px] text-gray-400 whitespace-nowrap">Jul 19 - Jul 25 📅</span>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { num: '76', label: 'New candidates to review', bg: '#4640DE' },
                        { num: '3',  label: 'Schedule for today',       bg: '#56CDAD' },
                        { num: '24', label: 'Messages received',         bg: '#26A4FF' },
                      ].map(({ num, label, bg }) => (
                        <div key={num} className="rounded p-2.5" style={{ background: bg }}>
                          <p className="text-white font-bold text-lg leading-none">{num}</p>
                          <p className="text-white/80 text-[8px] mt-1">{label}</p>
                          <span className="text-white text-xs">›</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Chart */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-semibold text-[#25324B]">Job statistics</p>
                          <div className="flex gap-1">
                            {['Week', 'Month', 'Year'].map((t, i) => (
                              <button key={t} className={`text-[8px] px-1.5 py-0.5 rounded ${i === 0 ? 'bg-[#4640DE] text-white' : 'text-gray-400'}`}>{t}</button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 mb-2">
                          {['Overview', 'Jobs View', 'Jobs Applied'].map((t, i) => (
                            <button key={t} className={`text-[8px] ${i === 0 ? 'text-[#4640DE] border-b border-[#4640DE]' : 'text-gray-400'}`}>{t}</button>
                          ))}
                        </div>
                        <div className="flex items-end gap-1 h-16">
                          {[{h1:60,h2:30},{h1:80,h2:55,tip:true},{h1:55,h2:35},{h1:70,h2:45},{h1:40,h2:25},{h1:50,h2:30},{h1:35,h2:20}].map((bar, i) => (
                            <div key={i} className="flex gap-0.5 items-end flex-1 relative">
                              {bar.tip && (
                                <div className="absolute -top-6 left-0 bg-gray-800 text-white text-[7px] px-1 py-0.5 rounded z-10 whitespace-nowrap">
                                  122<br/>34
                                </div>
                              )}
                              <div className="flex-1 bg-[#FFB836] rounded-t" style={{ height: `${bar.h1}%` }}></div>
                              <div className="flex-1 bg-[#4640DE] rounded-t" style={{ height: `${bar.h2}%` }}></div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-1">
                          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                            <span key={d} className="text-[7px] text-gray-400 flex-1 text-center">{d}</span>
                          ))}
                        </div>
                        <div className="flex gap-3 mt-1.5">
                          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#FFB836] rounded-sm"></div><span className="text-[7px] text-gray-400">Job View</span></div>
                          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#4640DE] rounded-sm"></div><span className="text-[7px] text-gray-400">Job Applied</span></div>
                        </div>
                      </div>

                      {/* Right Stats */}
                      <div>
                        <div className="mb-4">
                          <p className="text-[9px] text-gray-400 mb-0.5">Job Open</p>
                          <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-bold text-[#25324B] leading-none">12</p>
                            <span className="text-[9px] text-gray-400">Jobs Opened</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-400 mb-1">Applicants Summary</p>
                          <div className="flex items-baseline gap-1 mb-2">
                            <p className="text-2xl font-bold text-[#25324B] leading-none">67</p>
                            <span className="text-[9px] text-gray-400">Applicants</span>
                          </div>
                          <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
                            <div className="bg-[#4640DE]" style={{width:'30%'}}></div>
                            <div className="bg-[#56CDAD]" style={{width:'20%'}}></div>
                            <div className="bg-[#FFB836]" style={{width:'22%'}}></div>
                            <div className="bg-[#FF6550]" style={{width:'15%'}}></div>
                            <div className="bg-[#26A4FF]" style={{width:'13%'}}></div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-2">
                            {[
                              {color:'#4640DE', label:'Full Time',  count:45},
                              {color:'#56CDAD', label:'Internship', count:32},
                              {color:'#FFB836', label:'Part-Time',  count:24},
                              {color:'#FF6550', label:'Contract',   count:30},
                              {color:'#26A4FF', label:'Remote',     count:22},
                            ].map(({color, label, count}) => (
                              <div key={label} className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-sm shrink-0" style={{background: color}}></div>
                                <span className="text-[7px] text-gray-500">{label} {count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}