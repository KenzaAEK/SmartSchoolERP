
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import { api } from '../../services/api';
import { getAIDashboardInsights } from '../../services/gemini';
import { PredictionData } from '../../types';

const PredictiveDashboard: React.FC = () => {
  const [data, setData] = useState<PredictionData[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    api.getPredictionData().then(setData);
  }, []);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const stats = {
      totalStudents: 1248,
      passRate: "92.4%",
      riskAlerts: 4,
      trends: data
    };
    const insight = await getAIDashboardInsights(stats);
    setAiInsight(insight);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Prédictif</h1>
          <p className="text-gray-500">Statistiques globales et prévisions basées sur l'apprentissage automatique.</p>
        </div>
        <button 
          onClick={handleAIAnalysis}
          disabled={isAnalyzing}
          className="bg-white border-2 border-primary text-primary px-4 py-2 rounded-xl font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-sm"
        >
          {isAnalyzing ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="m16 8-4 4-4-4"/><path d="M12 22v-4"/><path d="m8 18 4-4 4 4"/></svg>
          )}
          Analyse Stratégique IA
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Étudiants', value: '1,248', change: '+12%', color: 'text-primary' },
          { label: 'Profs Actifs', value: '84', change: 'Stable', color: 'text-gray-600' },
          { label: 'Taux Réussite Prédit', value: '92.4%', change: '+3.2%', color: 'text-secondary' },
          { label: 'Taux d\'Alerte', value: '4.2%', change: '-1.1%', color: 'text-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] font-bold mt-2 text-green-600 bg-green-50 w-max px-2 py-0.5 rounded-full">{stat.change} vs l'an dernier</div>
          </div>
        ))}
      </div>

      {aiInsight && (
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-xl animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="m16 8-4 4-4-4"/><path d="M12 22v-4"/><path d="m8 18 4-4 4 4"/></svg>
          </div>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v19"/><path d="M5 8h14"/><path d="M15 13H9"/><path d="m11 17-2-2 2-2"/></svg>
             </div>
             <h3 className="font-bold">Analyse Stratégique par Gemini AI</h3>
          </div>
          <p className="text-sm font-medium leading-relaxed whitespace-pre-line opacity-90">{aiInsight}</p>
          <button onClick={() => setAiInsight('')} className="absolute top-4 right-4 hover:opacity-70">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            Prédiction du Taux de Réussite
            <span className="text-[10px] font-black bg-blue-100 text-primary px-2 py-1 rounded uppercase tracking-tighter">AI Model v4.1</span>
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066CC" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0066CC" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="successRate" name="Réel" stroke="#0066CC" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                <Area type="monotone" dataKey="predictedRate" name="Prédiction IA" stroke="#00994C" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Alertes de Risque Critique</h3>
          <div className="space-y-4">
            {[
              { student: 'Yassine El Amrani', class: 'GINF 3', risk: 'Elevé', reason: 'Baisse d\'assiduité (94% -> 82%)' },
              { student: 'Maria Garcia', class: 'GSTR 4', risk: 'Moyen', reason: 'Incohérence des notes en mathématiques' },
              { student: 'Omar Berrada', class: 'GINF 3', risk: 'Elevé', reason: 'Absence prolongée injustifiée' },
            ].map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 font-bold group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {alert.student[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">{alert.student}</div>
                    <div className="text-[11px] text-gray-400 font-medium">{alert.class} • {alert.reason}</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                  alert.risk === 'Elevé' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {alert.risk}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 text-gray-400 text-xs font-bold rounded-xl hover:border-primary hover:text-primary transition-all">
            Voir l'Analyse de Risque Complète
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictiveDashboard;
