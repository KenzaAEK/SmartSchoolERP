
import React, { useState } from 'react';
import { api } from '../../services/api';
import { MAJORS } from '../../data/mockData';

const ReportCenter: React.FC = () => {
  const [selectedMajor, setSelectedMajor] = useState(MAJORS[0].id);
  const [reportType, setReportType] = useState('transcript');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    const link = await api.generatePDF(reportType, { major: selectedMajor });
    setGeneratedLink(link);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Centre de Rapports</h1>
          <p className="text-gray-500 font-medium text-sm">Génération de documents officiels ENSA Tanger.</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-2">
           <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black text-primary uppercase tracking-widest">Générateur PDF V2 Actif</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 lg:col-span-1">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            Paramètres du Document
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Type de Document</label>
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="transcript">Bulletins de Notes (Transcripts)</option>
                <option value="pv">Procès-Verbaux de Jury (PV)</option>
                <option value="certificate">Certificats de Scolarité</option>
                <option value="attendance">Bilans d'Assiduité</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Filière / Section</label>
              <select 
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
              >
                {MAJORS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
            >
              {isGenerating ? 'Calcul des Données...' : 'Générer le PDF'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full min-h-[400px] flex flex-col">
            <div className="px-8 py-5 border-b bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-black text-gray-900 text-[11px] uppercase tracking-widest">Aperçu du Flux de Production</h3>
              <span className="text-[10px] font-bold text-gray-400">Dernière génération : Aujourd'hui, 09:42</span>
            </div>
            
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
              {isGenerating ? (
                <div className="space-y-4 animate-pulse">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
                  </div>
                  <p className="text-sm font-bold text-gray-500">Mise en page institutionnelle en cours...</p>
                </div>
              ) : generatedLink ? (
                <div className="animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-secondary/10 text-secondary rounded-3xl flex items-center justify-center mx-auto mb-6">
                     <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <h4 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Document Prêt !</h4>
                  <p className="text-gray-500 text-sm mb-8">Le fichier pour {selectedMajor} a été généré avec succès.</p>
                  <a 
                    href={generatedLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-3 bg-secondary text-white font-black rounded-xl shadow-xl hover:opacity-90 transition-all text-xs uppercase tracking-widest"
                  >
                    Télécharger le Fichier PDF
                  </a>
                </div>
              ) : (
                <div className="text-gray-300">
                  <svg className="mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18V12"/><path d="M9 15l3 3 3-3"/></svg>
                  <p className="text-sm font-bold italic">Sélectionnez les paramètres pour lancer la génération.</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-gray-50 flex gap-4">
               {[
                 { label: 'Tampon Officiel', status: true },
                 { label: 'Signature QR Code', status: true },
                 { label: 'Archivage Cloud', status: true }
               ].map((opt, i) => (
                 <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center">
                       <svg className="text-primary" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">{opt.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCenter;
