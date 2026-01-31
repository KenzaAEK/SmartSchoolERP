
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MAJORS } from '../../data/mockData';

const DeliberationBoard: React.FC = () => {
  const [selectedMajor, setSelectedMajor] = useState(MAJORS[0].id);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDelibs = async () => {
    setLoading(true);
    const res = await api.getDeliberationData(selectedMajor);
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    loadDelibs();
  }, [selectedMajor]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Conseil de Délibération</h1>
          <p className="text-gray-500 font-medium text-sm">Jury de fin de semestre • Règlement ENSA Tanger</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            className="bg-white border-2 border-gray-100 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none shadow-sm"
          >
            {MAJORS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PV de Délibération
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Admissibles', count: data.filter(d => d.status === 'Admis').length, color: 'text-secondary' },
          { label: 'Rattrapages', count: data.filter(d => d.status === 'Rattrapage').length, color: 'text-orange-500' },
          { label: 'Eliminés', count: data.filter(d => d.status.includes('Eliminé')).length, color: 'text-red-500' },
          { label: 'Moyenne Section', count: '13.42', color: 'text-primary' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</div>
            <div className={`text-3xl font-black ${s.color}`}>{loading ? '...' : s.count}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5 border-b">Code Apogée & Nom</th>
                <th className="px-8 py-5 border-b text-center">Modules Validés</th>
                <th className="px-8 py-5 border-b text-center">Moyenne / 20</th>
                <th className="px-8 py-5 border-b text-right">Décision Jury</th>
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
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-8 py-5">
                      <div className="text-sm font-black text-gray-800 tracking-tight">{row.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{row.id}</div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-sm font-bold text-gray-600">{row.modulesValidated} / 12</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className={`inline-block px-4 py-1.5 rounded-xl font-black text-lg ${
                        parseFloat(row.average) < 12 ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-primary'
                      }`}>
                        {row.average}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        row.status === 'Admis' ? 'bg-secondary text-white' :
                        row.status === 'Rattrapage' ? 'bg-orange-400 text-white' :
                        'bg-red-600 text-white'
                      }`}>
                        {row.status}
                      </span>
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

export default DeliberationBoard;
