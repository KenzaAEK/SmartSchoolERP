
import React, { useState, useEffect } from 'react';
import { MOCK_GRADES_GINF, MODULES } from '../../data/mockData';
import { getAIDashboardInsights } from '../../services/gemini';

const GradeEntry: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState(MODULES[0].id);
  const [grades, setGrades] = useState(MOCK_GRADES_GINF);
  const [saving, setSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');

  // Calculate real-time statistics
  const average = grades.reduce((acc, g) => acc + (g.grade || 0), 0) / (grades.length || 1);
  const passRate = (grades.filter(g => g.grade >= 12).length / grades.length) * 100;
  const absents = grades.filter(g => g.attendance === 'Absent').length;

  const handleGradeChange = (studentId: string, value: string) => {
    const numValue = parseFloat(value);
    setGrades(prev => prev.map(g => 
      g.studentId === studentId ? { 
        ...g, 
        grade: isNaN(numValue) ? 0 : Math.min(20, Math.max(0, numValue)) 
      } : g
    ));
  };

  const handleAttendanceChange = (studentId: string, status: string) => {
    setGrades(prev => prev.map(g => 
      g.studentId === studentId ? { ...g, attendance: status } : g
    ));
  };

  const handleAnalyzeDistribution = async () => {
    setIsAnalyzing(true);
    const data = {
      module: MODULES.find(m => m.id === selectedModule)?.name,
      average: average.toFixed(2),
      passRate: passRate.toFixed(0) + "%",
      scores: grades.map(g => g.grade)
    };
    const insight = await getAIDashboardInsights(data);
    setAiAnalysis(insight);
    setIsAnalyzing(false);
  };

  const saveGrades = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Notes enregistrées avec succès sur le serveur SGAI.");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saisie des Notes</h1>
          <p className="text-gray-500">Mise à jour directe du relevé académique.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select 
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="bg-white border-2 border-gray-100 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none shadow-sm"
          >
            {MODULES.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <button 
            onClick={handleAnalyzeDistribution}
            className="bg-white border-2 border-primary text-primary px-4 py-2 rounded-xl font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2"
          >
            {isAnalyzing ? 'Analyse...' : 'Analyse de Courbe IA'}
          </button>
          <button 
            onClick={saveGrades}
            disabled={saving}
            className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg"
          >
            {saving ? 'Synchronisation...' : 'Valider & Publier'}
          </button>
        </div>
      </div>

      {aiAnalysis && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl animate-in fade-in zoom-in duration-300 relative">
          <h4 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            Insight Pedagogique Gemini
          </h4>
          <p className="text-sm text-blue-700 leading-relaxed font-medium">{aiAnalysis}</p>
          <button onClick={() => setAiAnalysis('')} className="absolute top-4 right-4 text-blue-400 hover:text-blue-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Moyenne Section</div>
          <div className="text-3xl font-black text-primary">{average.toFixed(2)} <span className="text-sm font-normal text-gray-300">/ 20</span></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Taux de Réussite</div>
          <div className="text-3xl font-black text-secondary">{passRate.toFixed(0)}%</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Absences Examen</div>
          <div className="text-3xl font-black text-red-500">{absents}</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="p-6 border-b">Code & Étudiant</th>
                <th className="p-6 border-b text-center">Présence</th>
                <th className="p-6 border-b text-center">Note / 20</th>
                <th className="p-6 border-b text-right">Statut Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {grades.map((row) => (
                <tr key={row.studentId} className="hover:bg-blue-50/30 transition-all group">
                  <td className="p-6">
                    <div className="text-sm font-bold text-gray-800">{row.studentName}</div>
                    <div className="text-[10px] text-gray-400 font-mono tracking-tighter">{row.studentId}</div>
                  </td>
                  <td className="p-6 text-center">
                    <select 
                      value={row.attendance}
                      onChange={(e) => handleAttendanceChange(row.studentId, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none outline-none focus:ring-0 cursor-pointer ${
                        row.attendance === 'Present' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      <option value="Present">Présent</option>
                      <option value="Absent">Absent</option>
                      <option value="Excluded">Exclu</option>
                    </select>
                  </td>
                  <td className="p-6 text-center">
                    <input 
                      type="number"
                      min="0" max="20" step="0.25"
                      value={row.grade}
                      onChange={(e) => handleGradeChange(row.studentId, e.target.value)}
                      className={`w-24 px-4 py-3 rounded-2xl border-2 font-black text-center focus:ring-4 outline-none transition-all text-lg ${
                        row.grade < 5 ? 'border-red-100 bg-red-50 text-red-600 focus:ring-red-100' : 
                        row.grade < 12 ? 'border-orange-100 bg-orange-50 text-orange-600 focus:ring-orange-100' : 
                        'border-blue-50 bg-white text-primary focus:ring-blue-100'
                      }`}
                    />
                  </td>
                  <td className="p-6 text-right">
                    {row.grade < 5 ? (
                      <span className="px-3 py-1.5 bg-red-600 text-white text-[9px] font-black rounded-lg uppercase shadow-sm">Éliminé</span>
                    ) : row.grade >= 12 ? (
                      <span className="px-3 py-1.5 bg-secondary text-white text-[9px] font-black rounded-lg uppercase shadow-sm">Validé</span>
                    ) : (
                      <span className="px-3 py-1.5 bg-orange-500 text-white text-[9px] font-black rounded-lg uppercase shadow-sm">Rattrapage</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradeEntry;
