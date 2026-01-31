
import React, { useState } from 'react';
import { MOCK_STUDENTS, MODULES } from '../../data/mockData';

const AttendanceSheet: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState(MODULES[0].id);
  const [attendance, setAttendance] = useState<{ [key: string]: string }>(
    MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const markStatus = (id: string, status: string) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const markAllPresent = () => {
    const allPresent = MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {});
    setAttendance(allPresent);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Appel clôturé et synchronisé avec le service de scolarité.");
    }, 1000);
  };

  const stats = {
    p: Object.values(attendance).filter(v => v === 'present').length,
    a: Object.values(attendance).filter(v => v === 'absent').length,
    l: Object.values(attendance).filter(v => v === 'late').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appel Numérique</h1>
          <p className="text-gray-500">Mise à jour de l'assiduité en temps réel.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={markAllPresent}
            className="px-4 py-2 border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm"
          >
            Tous Présents
          </button>
          <select 
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="bg-white border-2 border-gray-100 rounded-xl px-4 py-2 text-sm font-bold outline-none shadow-sm"
          >
            {MODULES.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
          >
            {isSubmitting ? 'Envoi...' : 'Enregistrer l\'Appel'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-secondary flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-secondary rounded-2xl flex items-center justify-center font-black text-xl">{stats.p}</div>
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Présents</div>
            <div className="text-sm font-bold text-gray-700">Participation Active</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-red-500 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center font-black text-xl">{stats.a}</div>
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Absents</div>
            <div className="text-sm font-bold text-gray-700">À Justifier</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-orange-500 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center font-black text-xl">{stats.l}</div>
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retards</div>
            <div className="text-sm font-bold text-gray-700">Entrées tardives</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5 border-b">Étudiant</th>
                <th className="px-8 py-5 border-b text-center">Marquage Rapide</th>
                <th className="px-8 py-5 border-b text-right">Statut Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shadow-inner">
                        <img src={student.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-gray-800 tracking-tight">{student.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{student.id} • {student.major}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-3">
                      {[
                        { key: 'present', label: 'P', color: 'bg-secondary' },
                        { key: 'absent', label: 'A', color: 'bg-red-500' },
                        { key: 'late', label: 'R', color: 'bg-orange-500' }
                      ].map(btn => (
                        <button 
                          key={btn.key}
                          onClick={() => markStatus(student.id, btn.key)}
                          className={`w-10 h-10 rounded-xl font-black text-xs transition-all flex items-center justify-center border-2 ${
                            attendance[student.id] === btn.key 
                            ? `${btn.color} text-white border-transparent shadow-lg scale-110` 
                            : 'bg-white text-gray-300 border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      attendance[student.id] === 'present' ? 'bg-green-50 text-secondary border-secondary/20' :
                      attendance[student.id] === 'absent' ? 'bg-red-50 text-red-600 border-red-200' :
                      'bg-orange-50 text-orange-600 border-orange-200'
                    }`}>
                      {attendance[student.id]}
                    </span>
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

export default AttendanceSheet;
