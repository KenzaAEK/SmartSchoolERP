
import React, { useState } from 'react';
import { api } from '../../services/api';
import { extractDataFromDocument } from '../../services/gemini';

const ImportCenter: React.FC = () => {
  const [importType, setImportType] = useState<'students' | 'grades' | 'pdf-ocr'>('students');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [extractedData, setExtractedData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResult(null);
    setExtractedData([]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    if (importType === 'pdf-ocr') {
      // Conversion en base64 pour l'IA (Simulé ici par un reader)
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const data = await extractDataFromDocument(base64, file.type, 'transcript');
        setExtractedData(data || []);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      const res = await api.bulkImport(importType, file);
      setResult(res);
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Centre d'Importation</h1>
        <p className="text-gray-500 font-medium text-sm">Synchronisation massive et numérisation intelligente des documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-between">
          <div className="space-y-8">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs">1</span>
              Choisir la source
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'students', label: 'CSV Étudiants' },
                { id: 'grades', label: 'CSV Notes' },
                { id: 'pdf-ocr', label: 'PDF Scan (IA)' }
              ].map((type) => (
                <button 
                  key={type.id}
                  onClick={() => setImportType(type.id as any)}
                  className={`p-4 rounded-2xl border-2 font-bold text-xs transition-all text-center uppercase tracking-widest ${
                    importType === type.id ? 'border-primary bg-blue-50 text-primary' : 'border-gray-50 text-gray-400 hover:border-gray-100'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs">2</span>
              Télécharger le document
            </h3>
            <label className="block w-full cursor-pointer group">
              <div className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
                file ? 'border-secondary bg-green-50' : 'border-gray-200 group-hover:border-primary/50'
              }`}>
                {file ? (
                  <div className="text-secondary animate-in zoom-in duration-300">
                    <svg className="mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span className="text-sm font-black">{file.name}</span>
                    <p className="text-[10px] uppercase font-bold mt-1 opacity-60">Cliquer pour changer</p>
                  </div>
                ) : (
                  <div className="text-gray-300">
                    <svg className="mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <span className="text-xs font-black uppercase tracking-widest">Glissez vos fichiers {importType === 'pdf-ocr' ? 'PDF/JPG' : 'CSV'} ici</span>
                  </div>
                )}
                <input type="file" className="hidden" onChange={handleFileChange} accept={importType === 'pdf-ocr' ? 'application/pdf,image/*' : '.csv,.xlsx'} />
              </div>
            </label>
          </div>

          <button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full mt-10 py-5 bg-primary text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 disabled:opacity-50 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3"
          >
            {isUploading && <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            {isUploading ? (importType === 'pdf-ocr' ? 'Extraction IA en cours...' : 'Traitement SGAI...') : 'Lancer l\'Importation'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl h-full relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-20">
               <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-6">
                 <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">!</div>
                 <h3 className="text-lg font-bold">Aide à l'Importation</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                   <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Import CSV Classique</h4>
                   <p className="text-xs text-gray-400 leading-relaxed italic">Utilisez le template fourni. Le séparateur doit être le point-virgule (;).</p>
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Scanner Intelligent (PDF)</h4>
                   <p className="text-xs text-gray-400 leading-relaxed">SGAI utilise Gemini Vision pour lire vos relevés externes. Vérifiez les données après extraction.</p>
                </div>
              </div>
            </div>

            {result && (
              <div className="mt-8 p-5 bg-green-500/20 border border-green-500/40 rounded-2xl animate-in zoom-in duration-300">
                <div className="text-green-400 font-black text-[10px] uppercase tracking-widest mb-1">Succès</div>
                <div className="text-2xl font-black">{result.success} lignes importées</div>
              </div>
            )}

            {extractedData.length > 0 && (
              <div className="mt-8 p-5 bg-blue-500/20 border border-blue-500/40 rounded-2xl animate-in zoom-in duration-300">
                <div className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-1">Données Extraites (IA)</div>
                <div className="max-h-32 overflow-y-auto space-y-2 mt-3">
                   {extractedData.map((d, i) => (
                     <div key={i} className="text-[10px] flex justify-between border-b border-white/10 pb-1">
                        <span className="font-bold truncate max-w-[120px]">{d.subject || d.name}</span>
                        <span className="text-blue-300">{d.grade || d.apogee_code}</span>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-4 py-2 bg-blue-500 text-white text-[10px] font-black uppercase rounded-lg shadow-lg">Confirmer & Enregistrer</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportCenter;
