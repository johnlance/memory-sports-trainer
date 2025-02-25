import React, { useState, useEffect } from 'react';
import { Play, Pause, Save, RotateCcw } from 'lucide-react';

import CardDisplay from '../components/training/CardDisplay';

const TrainingPage = () => {
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionType, setSessionType] = useState('standard'); // standard, focused
  const [sessionData, setSessionData] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  // Timer for session duration
  useEffect(() => {
    let interval;
    
    if (isSessionActive && sessionStartTime) {
      interval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
        setSessionDuration(elapsedSeconds);
      }, 1000);
    } else if (!isSessionActive) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime]);
  
  // Format seconds as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle starting the session
  const handleStartSession = () => {
    setIsSessionActive(true);
    setSessionStartTime(Date.now());
    setSessionData([]);
  };
  
  // Handle pausing the session
  const handlePauseSession = () => {
    setIsSessionActive(false);
  };
  
  // Handle resetting the session
  const handleResetSession = () => {
    setIsSessionActive(false);
    setSessionStartTime(null);
    setSessionDuration(0);
    setSessionData([]);
  };
  
  // Handle saving session data
  const handleSaveSession = () => {
    // For MVP we'll just log to console and store in localStorage
    console.log('Session data:', sessionData);
    
    // Create a session summary
    const sessionSummary = {
      id: Date.now().toString(),
      startTime: new Date(sessionStartTime).toISOString(),
      duration: sessionDuration,
      cardCount: sessionData.length,
      type: sessionType,
      averageViewingTime: sessionData.reduce((sum, item) => sum + item.viewingTime, 0) / sessionData.length,
      cards: sessionData
    };
    
    // Get existing sessions from localStorage
    const existingSessions = JSON.parse(localStorage.getItem('trainingSessions') || '[]');
    
    // Add the new session
    const updatedSessions = [sessionSummary, ...existingSessions];
    
    // Save back to localStorage
    localStorage.setItem('trainingSessions', JSON.stringify(updatedSessions));
    
    alert('Session saved successfully!');
    handleResetSession();
  };
  
  // Handle when a card has been viewed
  const handleCardViewed = (cardData) => {
    setSessionData(prevData => [...prevData, cardData]);
  };
  
  // Calculate some basic stats for the current session
  const calculateSessionStats = () => {
    if (sessionData.length === 0) return null;
    
    const totalTime = sessionData.reduce((sum, data) => sum + data.viewingTime, 0);
    const avgTime = totalTime / sessionData.length;
    const cardsPerMinute = sessionData.length / (sessionDuration / 60);
    
    return {
      cardsViewed: sessionData.length,
      averageViewingTime: Math.round(avgTime),
      cardsPerMinute: Math.round(cardsPerMinute * 10) / 10
    };
  };
  
  const stats = calculateSessionStats();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Memory Training</h1>
      
      {/* Session Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Training Session</h2>
          <div className="text-gray-700 font-medium">
            Duration: {formatTime(sessionDuration)}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Type
            </label>
            <select 
              className="w-full border rounded-md px-3 py-2"
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
              disabled={isSessionActive}
            >
              <option value="standard">Standard Training</option>
              <option value="focused">Focused Training</option>
            </select>
          </div>
          
          {sessionType === 'focused' && (
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Focus Card
              </label>
              <select 
                className="w-full border rounded-md px-3 py-2"
                disabled={isSessionActive}
              >
                <option value="QS">Queen of Spades</option>
                <option value="KC">King of Clubs</option>
                <option value="JD">Jack of Diamonds</option>
                <option value="AH">Ace of Hearts</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {!isSessionActive ? (
            <button 
              onClick={handleStartSession}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Play size={16} className="mr-1" />
              Start Session
            </button>
          ) : (
            <button 
              onClick={handlePauseSession}
              className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
            >
              <Pause size={16} className="mr-1" />
              Pause
            </button>
          )}
          
          <button 
            onClick={handleResetSession}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            disabled={!sessionStartTime}
          >
            <RotateCcw size={16} className="mr-1" />
            Reset
          </button>
          
          <button 
            onClick={handleSaveSession}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={isSessionActive || sessionData.length === 0}
          >
            <Save size={16} className="mr-1" />
            Save Session
          </button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Card Display */}
        <div className="flex justify-center">
          <CardDisplay 
            isSessionActive={isSessionActive}
            onCardViewed={handleCardViewed}
            cardDelay={1000}
            focusedCards={
              sessionType === 'focused' 
                ? [{ value: 'Q', suit: '♠' }] 
                : []
            }
          />
        </div>
        
        {/* Session Stats */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Session Statistics</h2>
          
          {stats ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800 mb-1">Cards Viewed</div>
                  <div className="text-2xl font-bold">{stats.cardsViewed}</div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-800 mb-1">Cards/Minute</div>
                  <div className="text-2xl font-bold">{stats.cardsPerMinute}</div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-800 mb-1">Avg Time</div>
                  <div className="text-2xl font-bold">{stats.averageViewingTime} ms</div>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg">
                  <div className="text-sm text-amber-800 mb-1">Session Time</div>
                  <div className="text-2xl font-bold">{formatTime(sessionDuration)}</div>
                </div>
              </div>
              
              {sessionData.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Recent Cards</h3>
                  <div className="max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-2">
                      {sessionData.slice(-9).reverse().map((data, index) => (
                        <div 
                          key={index} 
                          className="p-2 border rounded-md text-center"
                        >
                          <div className={data.card.suit === '♥' || data.card.suit === '♦' ? 'text-red-600' : ''}>
                            {data.card.value}{data.card.suit}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round(data.viewingTime)} ms
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
              Start a session to view statistics
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;