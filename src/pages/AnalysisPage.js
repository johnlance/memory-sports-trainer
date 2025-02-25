import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, ArrowRight, Award, AlertCircle, Brain } from 'lucide-react';

const AnalysisPage = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [cardAnalysis, setCardAnalysis] = useState([]);
  const [problemCards, setProblemCards] = useState([]);
  
  // Load sessions on component mount
  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem('trainingSessions') || '[]');
    setSessions(savedSessions);
    
    // Select the most recent session by default if available
    if (savedSessions.length > 0) {
      setSelectedSession(savedSessions[0]);
    }
  }, []);
  
  // When a session is selected, analyze the data
  useEffect(() => {
    if (!selectedSession || !selectedSession.cards) return;
    
    // Group cards by value and suit
    const cardGroups = {};
    
    selectedSession.cards.forEach(cardData => {
      const cardKey = `${cardData.card.value}${cardData.card.suit}`;
      
      if (!cardGroups[cardKey]) {
        cardGroups[cardKey] = {
          card: cardData.card,
          times: [],
          averageTime: 0,
          count: 0
        };
      }
      
      cardGroups[cardKey].times.push(cardData.viewingTime);
      cardGroups[cardKey].count += 1;
    });
    
    // Calculate averages and prepare for chart
    const analysisData = Object.values(cardGroups).map(group => {
      const avgTime = group.times.reduce((sum, time) => sum + time, 0) / group.times.length;
      return {
        ...group,
        averageTime: Math.round(avgTime),
        card: `${group.card.value}${group.card.suit}`
      };
    });
    
    // Sort by average time (descending)
    analysisData.sort((a, b) => b.averageTime - a.averageTime);
    
    setCardAnalysis(analysisData);
    
    // Find problem cards (more than 20% above average)
    const overallAverage = selectedSession.averageViewingTime;
    const threshold = overallAverage * 1.2; // 20% higher than average
    
    const problems = analysisData.filter(card => card.averageTime > threshold);
    setProblemCards(problems);
    
  }, [selectedSession]);
  
  // Format date for display
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Generate recommendations based on analysis
  const generateRecommendations = () => {
    if (!problemCards.length) return [];
    
    const recommendations = [];
    
    // Recommend focusing on problem cards
    if (problemCards.length > 0) {
      recommendations.push({
        title: `Focus on slow cards`,
        description: `Create focused training sessions for ${problemCards.slice(0, 3).map(c => c.card).join(', ')} which take longer to process.`
      });
    }
    
    // Recommend session length
    if (selectedSession.duration > 300) { // More than 5 minutes
      recommendations.push({
        title: 'Optimize session length',
        description: 'Consider shorter, more frequent sessions as your speed decreases after 5 minutes of continuous training.'
      });
    }
    
    // Add some general recommendations
    recommendations.push({
      title: 'Improve memory anchors',
      description: 'Create stronger mental associations for face cards which tend to take longer to memorize.'
    });
    
    recommendations.push({
      title: 'Practice visualization',
      description: 'Enhance your mental visualization techniques to form stronger memory associations faster.'
    });
    
    return recommendations;
  };
  
  // No sessions state
  if (sessions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Performance Analysis</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Data Available</h2>
          <p className="text-gray-600 mb-6">
            Complete training sessions to generate performance analytics and personalized recommendations.
          </p>
          <Link 
            to="/training" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Start Training
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Performance Analysis</h1>
      
      {/* Session selector */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Session</h2>
        <div className="flex flex-wrap gap-2">
          {sessions.slice(0, 5).map((session) => (
            <button
              key={session.id}
              onClick={() => setSelectedSession(session)}
              className={`px-4 py-2 rounded-md text-sm ${
                selectedSession && selectedSession.id === session.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {formatDate(session.startTime)}
            </button>
          ))}
        </div>
      </div>
      
      {selectedSession && (
        <>
          {/* Session overview */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Session Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">Cards Viewed</div>
                <div className="text-2xl font-bold">{selectedSession.cardCount}</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 mb-1">Cards/Minute</div>
                <div className="text-2xl font-bold">
                  {Math.round((selectedSession.cardCount / selectedSession.duration) * 60 * 10) / 10}
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 mb-1">Avg Time</div>
                <div className="text-2xl font-bold">{Math.round(selectedSession.averageViewingTime)} ms</div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <div className="text-sm text-amber-600 mb-1">Session Type</div>
                <div className="text-2xl font-bold capitalize">{selectedSession.type}</div>
              </div>
            </div>
          </div>
          
          {/* Card timing analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Card Timing Analysis</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cardAnalysis.slice(0, 10)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="card" 
                      angle={-45} 
                      textAnchor="end" 
                      tick={{ fontSize: 12 }}
                      height={60}
                    />
                    <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'left' }} />
                    <Tooltip />
                    <Bar dataKey="averageTime" fill="#8884d8" name="Avg Time (ms)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Problem Areas</h2>
              
              {problemCards.length > 0 ? (
                <div className="space-y-4">
                  {problemCards.slice(0, 5).map((card, index) => (
                    <div key={index} className="p-4 border rounded-lg flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="p-2 bg-red-50 rounded-full mr-3">
                          <AlertCircle size={20} className="text-red-500" />
                        </div>
                        <div>
                          <div className="font-medium">{card.card}</div>
                          <div className="text-sm text-gray-500">
                            Appeared {card.count} times
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-500">
                          +{card.averageTime - Math.round(selectedSession.averageViewingTime)} ms
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.round((card.averageTime / selectedSession.averageViewingTime - 1) * 100)}% slower
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No significant problem areas detected in this session.
                </div>
              )}
            </div>
          </div>
          
          {/* AI Recommendations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">AI Recommendations</h2>
            </div>
            
            <div className="space-y-4">
              {generateRecommendations().map((recommendation, index) => (
                <div key={index} className="p-4 bg-indigo-50 rounded-lg">
                  <div className="font-medium text-indigo-800 mb-1">
                    {recommendation.title}
                  </div>
                  <div className="text-gray-700">
                    {recommendation.description}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Link
                to="/training"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Start Focused Training
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisPage;