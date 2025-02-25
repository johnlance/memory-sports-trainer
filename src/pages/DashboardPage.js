import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Award, BarChart3, PlayCircle, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalCards: 0,
    averageTime: 0,
    bestSpeed: 0
  });
  
  // Load session data on component mount
  useEffect(() => {
    // Get sessions from localStorage
    const savedSessions = JSON.parse(localStorage.getItem('trainingSessions') || '[]');
    setSessions(savedSessions);
    
    // Calculate stats if we have sessions
    if (savedSessions.length > 0) {
      const totalCards = savedSessions.reduce((sum, session) => sum + session.cardCount, 0);
      const totalTime = savedSessions.reduce((sum, session) => sum + session.averageViewingTime * session.cardCount, 0);
      const bestSession = savedSessions.reduce((best, current) => 
        (current.cardCount / current.duration) > (best.cardCount / best.duration) ? current : best
      , savedSessions[0]);
      
      setStats({
        totalSessions: savedSessions.length,
        totalCards: totalCards,
        averageTime: Math.round(totalTime / totalCards),
        bestSpeed: Math.round((bestSession.cardCount / bestSession.duration) * 60)
      });
    }
  }, []);
  
  // Format date to readable format
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format time in seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Generate chart data from sessions
  const generateChartData = () => {
    // Return last 10 sessions, oldest first
    return sessions.slice(0, 10).reverse().map((session, index) => ({
      name: `Session ${index + 1}`,
      avgTime: session.averageViewingTime,
      cardsPerMin: (session.cardCount / session.duration) * 60
    }));
  };
  
  // No sessions state
  if (sessions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Welcome to MemorySports.AI</h2>
          <p className="text-gray-600 mb-6">
            You haven't completed any training sessions yet. Start training to see your performance data and insights.
          </p>
          <Link 
            to="/training" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <PlayCircle size={18} className="mr-2" />
            Start Training
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Award size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Sessions</p>
              <p className="text-2xl font-semibold">{stats.totalSessions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <BarChart3 size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Cards Memorized</p>
              <p className="text-2xl font-semibold">{stats.totalCards}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Clock size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Avg. Time Per Card</p>
              <p className="text-2xl font-semibold">{stats.averageTime} ms</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <Award size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Best Speed</p>
              <p className="text-2xl font-semibold">{stats.bestSpeed} cards/min</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Performance Trends</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={generateChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" label={{ value: 'Avg Time (ms)', angle: -90, position: 'left' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Cards/min', angle: -90, position: 'right' }} />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="avgTime" stroke="#8884d8" name="Avg Time (ms)" />
              <Line yAxisId="right" type="monotone" dataKey="cardsPerMin" stroke="#82ca9d" name="Cards/min" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Sessions</h2>
          <Link to="/analysis" className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
            View All
            <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cards
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cards/Min
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.slice(0, 5).map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(session.startTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {session.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(session.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.cardCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.round(session.averageViewingTime)} ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.round((session.cardCount / session.duration) * 60 * 10) / 10}
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

export default DashboardPage;