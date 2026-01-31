
import React, { useState } from 'react';
import { getAIScheduleSuggestion } from '../../services/gemini';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const HOURS = Array.from({ length: 9 }, (_, i) => `${i + 8}:00`);

const ScheduleOptimizer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState('');
  const [optimized, setOptimized] = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    const suggestion = await getAIScheduleSuggestion("Avoid class gaps, balance morning/afternoon loads, minimize teacher travel between blocks.");
    setInsight(suggestion);
    setOptimized(true);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Schedule Optimizer</h1>
            <p className="text-gray-500">Generate conflict-free timetables using genetic algorithms and Gemini reasoning.</p>
          </div>
          <button 
            onClick={handleOptimize}
            disabled={loading}
            className={`px-8 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="m16 8-4 4-4-4"/><path d="M12 22v-4"/><path d="m8 18 4-4 4 4"/></svg>
            )}
            Run AI Optimization
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Class Target</label>
            <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20">
              <option>Computer Science Year 1</option>
              <option>Computer Science Year 2</option>
              <option>Data Engineering Year 3</option>
            </select>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border">
              <input type="checkbox" defaultChecked />
              <span className="text-xs font-medium">No gaps</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border">
              <input type="checkbox" defaultChecked />
              <span className="text-xs font-medium">Equilibrate days</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border">
              <input type="checkbox" />
              <span className="text-xs font-medium">Max 6h/day</span>
            </div>
          </div>
          {insight && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
              <div className="mt-1">
                <svg className="text-primary" width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
              </div>
              <p className="text-xs text-blue-800 font-medium italic">"{insight}"</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4 border-b">Time</th>
                {DAYS.map(day => <th key={day} className="p-4 border-b border-l">{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour, idx) => (
                <tr key={hour} className="group">
                  <td className="p-4 border-b text-sm font-semibold text-gray-400 bg-gray-50/50">{hour}</td>
                  {DAYS.map((day, dIdx) => {
                    const hasCourse = optimized && (idx + dIdx) % 3 === 0;
                    return (
                      <td key={`${day}-${hour}`} className="p-2 border-b border-l min-w-[140px] h-20">
                        {hasCourse ? (
                          <div className={`h-full p-2 rounded-lg text-xs font-bold transition-all transform hover:scale-[1.02] cursor-pointer shadow-sm flex flex-col justify-between ${
                            idx % 2 === 0 ? 'bg-blue-100 text-primary border-l-4 border-primary' : 'bg-green-100 text-secondary border-l-4 border-secondary'
                          }`}>
                            <span>{idx % 2 === 0 ? 'Advanced Java' : 'Data Structures'}</span>
                            <span className="opacity-60 font-medium">Room {100 + idx}</span>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                            <span className="text-[10px] text-gray-300 font-bold opacity-0 group-hover:opacity-100">+ Add</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScheduleOptimizer;
