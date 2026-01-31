
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { getGradeGoalSimulation } from '../../services/gemini';
import { Grade } from '../../types';

const StudentGrades: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetGPA, setTargetGPA] = useState<number>(14);
  const [simulationResult, setSimulationResult] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    api.getGrades('S202401').then((res) => {
      setGrades(res);
      setLoading(false);
    });
  }, []);

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const totalPoints = grades.reduce((acc, g) => acc + (g.value * g.weight), 0);
    const totalWeights = grades.reduce((acc, g) => acc + g.weight, 0);
    return totalPoints / totalWeights;
  };

  const gpa = calculateGPA();

  const handleSimulate = async () => {
    setIsSimulating(true);
    const result = await getGradeGoalSimulation(gpa, targetGPA);
    setSimulationResult(result);
    setIsSimulating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Relevé de Notes Interactif</h1>
          <p className="text-gray-500 font-medium">Analyse temps réel de tes performances académiques.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-2.5 bg-white border-2 border-gray-100 text-gray-700 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exporter (PDF)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group lg:col-span-1">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Moyenne Générale</div>
          <div className="text-4xl font-black text-primary">{loading ? '...' : gpa.toFixed(2)} <span className="text-sm font-normal text-gray-400">/ 20</span></div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(gpa/20)*100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 lg:col-span-1">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Progression</div>
          <div className="flex items-center gap-3 mt-2">
             {gpa >= 12 ? (
               <div className="w-10 h-10 bg-green-50 text-secondary rounded-2xl flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
               </div>
             ) : (
               <div className="w-10 h-10 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
               </div>
             )}
             <div>
               <div className="text-lg font-black text-gray-900">{gpa >= 12 ? 'Admis' : 'En risque'}</div>
               <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Objectif : 12.00</div>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-primary/10 lg:col-span-2 relative">
          <div className="flex items-center justify-between mb-4">
             <div className="text-[10px] font-black text-primary uppercase tracking-widest">Simulateur d'Objectif IA</div>
             <div className="flex items-center gap-2">
                <input 
                  type="number" min="10" max="20" step="0.5"
                  className="w-16 px-2 py-1 bg-primary/5 border-none rounded-lg text-primary font-black text-sm text-center outline-none focus:ring-2 focus:ring-primary/20"
                  value={targetGPA}
                  onChange={(e) => setTargetGPA(parseFloat(e.target.value))}
                />
                <button 
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="bg-primary text-white p-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="m16 8-4 4-4-4"/></svg>
                </button>
             </div>
          </div>
          <p className="text-xs font-medium text-gray-600 leading-relaxed">
            {isSimulating ? 'Calcul de la trajectoire par Gemini...' : (simulationResult || "Entre une moyenne cible pour savoir comment l'atteindre.")}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-8 py-5 border-b flex items-center justify-between bg-gray-50/50">
          <h3 className="font-black text-gray-900 text-sm uppercase tracking-tight">Modules du Semestre Actuel</h3>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mis à jour il y a 2h</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4 border-b">Intitulé du Module</th>
                <th className="px-8 py-4 border-b text-center">Coeff</th>
                <th className="px-8 py-4 border-b text-center">Note / 20</th>
                <th className="px-8 py-4 border-b text-right">Statut Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-8 py-6 h-16 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : (
                grades.map((grade) => (
                  <tr key={grade.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-8 py-6">
                      <div className="text-sm font-black text-gray-800 group-hover:text-primary transition-colors tracking-tight">{grade.subject}</div>
                      <div className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-tight">{grade.teacherName} • {grade.date}</div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-3 py-1 bg-gray-100 rounded-xl text-[10px] font-black text-gray-500 uppercase">x{grade.weight}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl font-black text-lg shadow-inner ${
                        grade.value < 5 ? 'bg-red-50 text-red-600' :
                        grade.value < 12 ? 'bg-orange-50 text-orange-600' :
                        'bg-blue-50 text-primary'
                      }`}>
                        {grade.value.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {grade.value < 5 ? (
                        <span className="px-4 py-1.5 bg-red-600 text-white text-[9px] font-black rounded-lg uppercase shadow-lg">Eliminatoire</span>
                      ) : grade.value < 12 ? (
                        <span className="px-4 py-1.5 bg-orange-500 text-white text-[9px] font-black rounded-lg uppercase shadow-lg">Rattrapage</span>
                      ) : (
                        <span className="px-4 py-1.5 bg-secondary text-white text-[9px] font-black rounded-lg uppercase shadow-lg">Validé</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;
