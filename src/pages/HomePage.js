import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Award, BarChart, Clock } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Elevate Your Memory Sports Performance
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Advanced training and AI-powered analysis for competitive memory athletes.
          Identify patterns, overcome challenges, and track your improvement.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/register" 
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
          <Link 
            to="/login" 
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Brain className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">
              Focused Training
            </h3>
            <p className="text-gray-600 text-center">
              Targeted sessions that address your specific challenges, with dynamic 
              card sequences designed to strengthen your weakest areas.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <BarChart className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">
              AI Analysis
            </h3>
            <p className="text-gray-600 text-center">
              Advanced pattern recognition detects your millisecond-level hesitations 
              and provides data-driven insights to optimize your training.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-3">
              Performance Tracking
            </h3>
            <p className="text-gray-600 text-center">
              Comprehensive metrics and visualizations show your improvement over 
              time, helping you prepare effectively for competitions.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ready to enhance your memory sports performance?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join today and get access to our advanced training tools, AI-powered 
          analysis, and personalized improvement recommendations.
        </p>
        <Link 
          to="/register" 
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-block"
        >
          Start Training Now
        </Link>
      </section>
    </div>
  );
};

export default HomePage;