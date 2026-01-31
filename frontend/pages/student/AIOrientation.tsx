
import React, { useState, useEffect } from 'react';
import { getAIOrientationInsights } from '../../services/gemini';
import { AIRecommendation } from '../../types';

const Gauge: React.FC<{ score: number, color: string }> = ({ score, color }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-24 h-24">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
        />
        <circle
          style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          className="transition-all duration-1000 ease-out"
          strokeWidth="8"
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx="48"
          cy="48"
        />
      </svg>
      <span className="absolute text-lg font-bold" style={{ color }}>{score}%</span>
    </div>
  );
};

const AIOrientation: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAI = async () => {
      // Passing dummy student profile to simulate backend extraction
      const data = "Interests: Web development, Mathematics, Solving complex problems. Grades: Excellent in IT, Good in Physics, Average in Literature.";
      const res = await getAIOrientationInsights(data);
      setRecommendations(res);
      setLoading(false);
    };
    fetchAI();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Orientation Insights</h1>
          <p className="text-gray-500">Discover your path based on academic performance and cognitive profile.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
          <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-blue-700">AI Analysis Active</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white rounded-2xl shadow-sm"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <Gauge score={rec.score} color={rec.score > 85 ? '#00994C' : '#0066CC'} />
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  rec.confidence === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {rec.confidence} Confidence
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{rec.major}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{rec.description}</p>
              <button className="w-full py-2 bg-gray-50 text-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                View Roadmap
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Why these results?</h2>
        <p className="opacity-90 mb-6 max-w-2xl">
          Our Smart AI analyzes 12+ data points including your test history, attendance consistency, and peer collaboration metrics to predict career success rates.
        </p>
        <button className="px-6 py-3 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-colors">
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default AIOrientation;
