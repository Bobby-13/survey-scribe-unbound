
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { Section, Question } from '@/types/survey';
import QuestionCard from './QuestionCard';

interface SectionCardProps {
  section: Section;
  questions: Question[];
  onDeleteSection: (sectionId: string) => void;
  onAddQuestion: (sectionId: string) => void;
  onEditQuestion: (questionId: string) => void;
  onDeleteQuestion: (questionId: string) => void;
}

const SectionCard = ({ 
  section, 
  questions, 
  onDeleteSection, 
  onAddQuestion, 
  onEditQuestion, 
  onDeleteQuestion 
}: SectionCardProps) => {
  const sectionQuestions = questions.filter(q => q.sectionId === section.id && !q.isBranched);

  return (
    <Card key={section.id} className="border-gray-200">
      <CardHeader className="bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{section.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {sectionQuestions.length} Questions
            </Badge>
            {section.id !== 'general' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteSection(section.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {sectionQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              onEdit={onEditQuestion}
              onDelete={onDeleteQuestion}
            />
          ))}
          
          <Button
            onClick={() => onAddQuestion(section.id)}
            variant="outline"
            className="w-full border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionCard;
