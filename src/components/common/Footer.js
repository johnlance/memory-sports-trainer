import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="md:flex md:justify-between">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MemorySports.AI</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500 max-w-md">
              Advanced training and AI-powered analysis for competitive memory athletes. 
              Improve your performance with data-driven insights.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:gap-24">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/training" className="text-base text-gray-500 hover:text-gray-900">
                    Training
                  </Link>
                </li>
                <li>
                  <Link to="/analysis" className="text-base text-gray-500 hover:text-gray-900">
                    Analysis
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-base text-gray-500 hover:text-gray-900">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} MemorySports.AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;