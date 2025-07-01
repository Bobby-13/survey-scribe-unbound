
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Settings, Trash2 } from 'lucide-react';
import { Question } from '@/types/survey';

interface QuestionCardProps {
  question: Question;
  index: number;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
}

const QuestionCard = ({ question, index, onEdit, onDelete }: QuestionCardProps) => {
  return (
    <div key={question.id} className="border rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <GripVertical className="w-5 h-5 text-gray-400 mt-1 cursor-move" />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium">Question {index + 1}</span>
              <Badge variant="outline">{question.type}</Badge>
              {question.required && (
                <Badge className="bg-red-100 text-red-800">Required</Badge>
              )}
              {question.branchingRules.length > 0 && (
                <Badge className="bg-blue-100 text-blue-800">Has Branching</Badge>
              )}
            </div>
            <p className="text-gray-700 mb-2">{question.question}</p>
            {question.description && (
              <p className="text-sm text-gray-500 mb-2">{question.description}</p>
            )}
            {(question.type === 'multiple-choice' || question.type === 'checkbox' || question.type === 'dropdown') && (
              <div className="flex flex-wrap gap-1">
                {question.options?.map((option, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {option}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(question.id)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(question.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
