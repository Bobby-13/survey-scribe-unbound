
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Eye, Save } from 'lucide-react';

interface SurveyBuilderHeaderProps {
  onPreview: () => void;
  onSave: () => void;
}

const SurveyBuilderHeader = ({ onPreview, onSave }: SurveyBuilderHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Survey Builder</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
            <Home className="w-4 h-4" />
            <span>Master Data</span>
            <span>/</span>
            <span className="text-red-600">Survey Builder</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={onPreview}
            variant="outline"
            className="border-gray-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button 
            onClick={onSave}
            className="bg-red-600 hover:bg-red-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SurveyBuilderHeader;
