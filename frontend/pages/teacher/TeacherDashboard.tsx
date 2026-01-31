
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { getAITeacherInsights } from '../../services/gemini';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TeacherDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState('');

  useEffect(() => {
    api.getTeacherStats('PRF-42').then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const handleAIReport = async () => {
    setIsAnalyzing(true);
    const report = await getAITeacherInsights(stats);
    setAiReport(report);
    setIsAnalyzing(false);
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">SGAI Engine: Loading Teacher Hub...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenue, Pr. Alami</h1>
          <p className="text-gray-500">Gérez vos modules et suivez la progression de vos étudiants.</p>
        </div>
        <button 
          onClick={handleAIReport}
          disabled={isAnalyzing}
          className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
        >
          {isAnalyzing ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="m16 8-4 4-4-4"/><path d="M12 22v-4"/><path d="m8 18 4-4 4 4"/></svg>
          )}
          Diagnostic Pédagogique IA
        </button>
      </div>

      {aiReport && (
        <div className="bg-secondary text-white p-6 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="m16 8-4 4-4-4"/><path d="M12 22v-4"/><path d="m8 18 4-4 4 4"/></svg>
          </div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
             </div>
             <h3 className="font-bold">Rapport de Santé de Classe (Gemini)</h3>
          </div>
          <p className="text-sm leading-relaxed opacity-95">{aiReport}</p>
          <button onClick={() => setAiReport('')} className="absolute top-4 right-4 text-white hover:opacity-70 transition-opacity">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Effectif Total</div>
            <div className="text-3xl font-black text-gray-900">{stats.totalStudents}</div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-secondary">
             <span>↑ 5% nouveaux inscrits</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Moyenne Globale</div>
            <div className="text-3xl font-black text-primary">{stats.avgClassGrade} <span className="text-sm font-normal text-gray-400">/ 20</span></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded w-max">
             Performance Stable
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tâches en Attente</div>
            <div className="text-3xl font-black text-orange-500">{stats.pendingGrades}</div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-orange-400">
             Saisie de notes JEE requise
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800 tracking-tight">Analyse de Performance par Module</h3>
            <div className="flex gap-2">
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                  <div className="w-2 h-2 bg-primary rounded-full"></div> Réussite
               </div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div> Engagement
               </div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.classPerformance} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="avg" radius={[8, 8, 0, 0]} barSize={45}>
                  {stats.classPerformance.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0066CC' : '#00994C'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Agenda du jour
          </h3>
          <div className="space-y-5">
            {[
              { time: '08:30', subject: 'Architecture JEE', loc: 'Amphi A • GINF 3', color: 'primary' },
              { time: '10:30', subject: 'TP Spring Boot', loc: 'Labo 4 • GINF 3', color: 'secondary' },
              { time: '14:30', subject: 'Conseil de Classe', loc: 'Salle de Réunion', color: 'gray-300' },
            ].map((slot, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className="text-xs font-black text-gray-300 mt-1">{slot.time}</div>
                <div className={`flex-1 pl-4 border-l-4 border-${slot.color} py-0.5 group-hover:bg-gray-50 transition-colors rounded-r-lg`}>
                  <div className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">{slot.subject}</div>
                  <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{slot.loc}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-gray-50 text-primary font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-50 transition-all">
            Emploi du temps complet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
