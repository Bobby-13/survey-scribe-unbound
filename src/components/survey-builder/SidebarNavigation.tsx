
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, FileText, BarChart3, BookOpen, User } from 'lucide-react';

const SidebarNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-red-600 text-white flex flex-col">
      <div className="p-4 border-b border-red-500">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-red-600 font-bold text-sm">G</span>
          </div>
          <span className="font-semibold">Survey Builder</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded hover:bg-red-500 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          
          <button
            onClick={() => navigate('/surveys')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded hover:bg-red-500 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Surveys</span>
          </button>
          
          <button
            onClick={() => navigate('/analytics')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded hover:bg-red-500 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
          
          <div className="bg-red-700 rounded px-3 py-2">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-4 h-4" />
              <span>Survey Builder</span>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-red-500">
        <div className="flex items-center space-x-2">
          <User className="w-6 h-6" />
          <div>
            <div className="text-sm font-medium">Survey Creator</div>
            <div className="text-xs text-red-200">Survey Manager</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarNavigation;
