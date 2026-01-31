
import React from 'react';
import { WEEKLY_SCHEDULE } from '../../data/mockData';

const WeeklySchedule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Emploi du Temps</h1>
          <p className="text-gray-500">Semestre 5 - Génie Informatique (GINF)</p>
        </div>
        <div className="bg-white border rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-gray-600 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Mise à jour le 12 Février 2024
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {WEEKLY_SCHEDULE.map((dayData) => (
          <div key={dayData.day} className="space-y-4">
            <div className="bg-primary text-white p-3 rounded-xl font-bold text-center shadow-sm">
              {dayData.day}
            </div>
            <div className="space-y-3">
              {dayData.slots.length > 0 ? (
                dayData.slots.map((slot, idx) => (
                  <div key={idx} className={`${slot.color} p-4 rounded-2xl border-l-4 border-current shadow-sm hover:scale-[1.02] transition-transform cursor-pointer group`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">{slot.time}</div>
                    <div className="font-bold text-sm mb-2">{slot.subject}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] bg-white/50 px-2 py-0.5 rounded font-bold">{slot.room}</span>
                      <span className="text-[10px] font-black uppercase">{slot.type}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl text-gray-300 text-xs font-bold">
                  Pas de cours
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div>
          <h4 className="font-bold text-orange-900 text-sm">Modification Exceptionnelle</h4>
          <p className="text-xs text-orange-700">Le cours de "Recherche Opérationnelle" du Jeudi est déplacé en Salle de Conférence exceptionnellement.</p>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;
