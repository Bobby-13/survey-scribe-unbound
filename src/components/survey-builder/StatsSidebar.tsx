
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Calendar } from 'lucide-react';
import { Section, Question } from '@/types/survey';

interface StatsSidebarProps {
  sections: Section[];
  questions: Question[];
  onQuickAddQuestion: (type: string) => void;
}

const StatsSidebar = ({ sections, questions, onQuickAddQuestion }: StatsSidebarProps) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Survey Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sections.length}</div>
              <div className="text-sm text-gray-600">Sections</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{questions.length}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {questions.filter(q => q.required).length}
              </div>
              <div className="text-sm text-gray-600">Required</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {questions.filter(q => q.branchingRules.length > 0).length}
              </div>
              <div className="text-sm text-gray-600">Branching</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Estimated Time:</span>
              <span className="font-medium">{Math.ceil(questions.length * 0.5)} min</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Branched Questions:</span>
              <span className="font-medium">{questions.filter(q => q.isBranched).length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Add Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {[
              { type: 'text', label: 'Text', icon: FileText },
              { type: 'textarea', label: 'Long Text', icon: FileText },
              { type: 'multiple-choice', label: 'Choice', icon: FileText },
              { type: 'checkbox', label: 'Checkbox', icon: FileText },
              { type: 'dropdown', label: 'Dropdown', icon: FileText },
              { type: 'rating', label: 'Rating', icon: FileText },
              { type: 'date', label: 'Date', icon: Calendar },
            ].map((questionType) => (
              <Button
                key={questionType.type}
                size="sm"
                variant="outline"
                onClick={() => onQuickAddQuestion(questionType.type)}
                className="text-xs hover:bg-red-50 hover:border-red-300"
              >
                <questionType.icon className="w-3 h-3 mr-1" />
                {questionType.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSidebar;
