
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<any>(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    const data = await api.getAllTeachers();
    setTeachers(data);
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setCurrentTeacher({ id: `PRF-${Date.now()}`, name: '', email: '', specialty: '', status: 'Active', load: 15 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (teacher: any) => {
    setCurrentTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Voulez-vous supprimer ce professeur de la base ?')) {
      await api.deleteTeacher(id);
      setTeachers(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await api.saveTeacher(currentTeacher);
    if (teachers.find(t => t.id === currentTeacher.id)) {
      setTeachers(prev => prev.map(t => t.id === currentTeacher.id ? currentTeacher : t));
    } else {
      setTeachers(prev => [currentTeacher, ...prev]);
    }
    setIsModalOpen(false);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Corps Enseignant</h1>
          <p className="text-gray-500">Gestion du staff académique et des charges horaires.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="17" y1="11" x2="23" y2="11"/></svg>
          Recruter un Professeur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && teachers.length === 0 ? (
          [1,2,3].map(i => <div key={i} className="h-48 bg-white animate-pulse rounded-2xl border"></div>)
        ) : teachers.map(teacher => (
          <div key={teacher.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-1.5 h-full ${teacher.status === 'Active' ? 'bg-secondary' : 'bg-orange-400'}`}></div>
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold text-xl shadow-inner">
                  {teacher.name.split(' ').pop()?.[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">{teacher.name}</h3>
                  <p className="text-[11px] text-gray-400 font-mono">{teacher.id}</p>
                </div>
              </div>
              <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${teacher.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                {teacher.status}
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Spécialité</span>
                <span className="text-gray-700 font-bold">{teacher.specialty}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Charge/Sem.</span>
                <span className="text-gray-700 font-bold">{teacher.load}h</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Email</span>
                <span className="text-gray-700 font-medium truncate ml-4">{teacher.email}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleOpenEdit(teacher)}
                className="flex-1 py-2 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Modifier
              </button>
              <button 
                onClick={() => handleDelete(teacher.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Fiche Enseignant</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Nom complet</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  value={currentTeacher.name}
                  onChange={(e) => setCurrentTeacher({...currentTeacher, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Email académique</label>
                <input 
                  type="email" required
                  className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  value={currentTeacher.email}
                  onChange={(e) => setCurrentTeacher({...currentTeacher, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Spécialité</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    value={currentTeacher.specialty}
                    onChange={(e) => setCurrentTeacher({...currentTeacher, specialty: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Statut</label>
                  <select 
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    value={currentTeacher.status}
                    onChange={(e) => setCurrentTeacher({...currentTeacher, status: e.target.value})}
                  >
                    <option value="Active">Actif</option>
                    <option value="Sabbatical">Congé/Sabbatique</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-500 font-bold text-sm">Annuler</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
