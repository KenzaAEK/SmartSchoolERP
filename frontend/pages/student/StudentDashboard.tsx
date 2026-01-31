
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { api } from '../../services/api';
import { getStudentDashboardInsights } from '../../services/gemini';
import { MOCK_STUDENTS } from '../../data/mockData';
import { Icons } from '../../constants';

const StudentDashboard: React.FC = () => {
  const [student] = useState(MOCK_STUDENTS[0]);
  const [grades, setGrades] = useState<any[]>([]);
  const [aiTip, setAiTip] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const g = await api.getGrades(student.id);
      setGrades(g);
      
      const avg = g.reduce((acc, curr) => acc + curr.value, 0) / (g.length || 1);
      const tip = await getStudentDashboardInsights(student.name, { 
        average: avg.toFixed(2), 
        attendance: student.attendanceRate 
      });
      setAiTip(tip);
      setLoading(false);
    };
    init();
  }, [student]);

  const avg = (grades.reduce((acc, curr) => acc + curr.value, 0) / (grades.length || 1)).toFixed(2);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-white">
            <img src={student.avatar} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Bonjour, {student.name.split(' ')[0]} 👋</h1>
            <p className="text-gray-500 font-medium">Consulte ton état d'avancement pour le Semestre 5.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Promotion</div>
            <div className="text-sm font-bold text-primary">{student.class} - GINF</div>
          </div>
          <div className="h-10 w-[1px] bg-gray-200"></div>
          <div className="text-right">
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Scolarité</div>
            <div className="text-sm font-bold text-secondary">Inscrit (Valide)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Moyenne Actuelle</span>
              <div className="p-2 bg-blue-50 text-primary rounded-xl"><Icons.Grades /></div>
            </div>
            <div className="text-4xl font-black text-primary">{loading ? '...' : avg}</div>
            <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">Calculé sur {grades.length} modules</p>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-50">
             <NavLink to="/grades" className="text-xs font-black text-primary hover:underline flex items-center gap-2">
                Détails du relevé <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
             </NavLink>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assiduité</span>
              <div className="p-2 bg-green-50 text-secondary rounded-xl"><Icons.Dashboard /></div>
            </div>
            <div className="text-4xl font-black text-secondary">{student.attendanceRate}%</div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
               <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${student.attendanceRate}%` }}></div>
            </div>
          </div>
          <p className="text-[10px] font-bold text-gray-400 mt-6 uppercase tracking-tighter">Seuil de radiation : 75%</p>
        </div>

        <div className="bg-primary p-6 rounded-3xl shadow-xl flex flex-col justify-between text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <Icons.Brain />
          </div>
          <div className="flex items-center gap-2 mb-4">
             <div className="p-2 bg-white/20 rounded-xl"><Icons.Brain /></div>
             <span className="text-[10px] font-black uppercase tracking-widest">SGAI Insight</span>
          </div>
          <p className="text-sm font-medium leading-relaxed italic">
            {loading ? 'Analyse en cours...' : `"${aiTip}"`}
          </p>
          <div className="mt-6">
            <NavLink to="/orientation" className="inline-block px-4 py-2 bg-white text-primary rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-gray-50 transition-colors">
              Mon Orientation IA
            </NavLink>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Icons.Calendar />
              Prochains Examens & Rendu
           </h3>
           <div className="space-y-4">
              {[
                { title: 'Architecture JEE (Final)', date: '12 Juin', time: '08:30', status: 'Urgent' },
                { title: 'Projet IA & Big Data', date: '18 Juin', time: '23:59', status: 'Normal' },
                { title: 'Anglais (TOEIC Mock)', date: '21 Juin', time: '14:30', status: 'Optionnel' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-center bg-gray-100 px-3 py-1 rounded-xl">
                      <div className="text-xs font-black text-primary">{item.date.split(' ')[0]}</div>
                      <div className="text-[10px] font-bold text-gray-400">{item.date.split(' ')[1]}</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{item.title}</div>
                      <div className="text-[10px] font-medium text-gray-400">{item.time} • Amphi A</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    item.status === 'Urgent' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-primary'
                  }`}>{item.status}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-3">
                 <Icons.Calendar />
                 Emploi du temps (Aujourd'hui)
              </h3>
              <NavLink to="/schedule-view" className="text-xs font-bold text-primary hover:underline">Voir la semaine</NavLink>
           </div>
           <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
              {[
                { time: '08:30', title: 'Architecture JEE', loc: 'Amphi A', color: 'primary' },
                { time: '10:30', title: 'TP Spring Boot', loc: 'Labo 4', color: 'secondary' },
                { time: '14:30', title: 'Management de Projet', loc: 'Salle 5', color: 'primary' },
              ].map((slot, i) => (
                <div key={i} className="flex gap-6 relative pl-8">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm bg-${slot.color}`}></div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-gray-300 mb-1 tracking-widest">{slot.time}</div>
                    <div className="text-sm font-bold text-gray-800">{slot.title}</div>
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{slot.loc} • Pr. Alami</div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
