
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Section, Question } from '@/types/survey';

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  surveyTitle: string;
  surveyDescription: string;
  sections: Section[];
  questions: Question[];
}

const PreviewDialog = ({ 
  isOpen, 
  onClose, 
  surveyTitle, 
  surveyDescription, 
  sections, 
  questions 
}: PreviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Survey Preview</DialogTitle>
        </DialogHeader>
        <div>
          <h2 className="text-2xl font-bold mb-4">{surveyTitle}</h2>
          <p className="text-gray-600 mb-6">{surveyDescription}</p>
          {sections.map((section) => (
            <div key={section.id} className="mb-8">
              <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
              {questions.filter(q => q.sectionId === section.id).map((question) => (
                <div key={question.id} className="mb-4">
                  <p className="font-medium">{question.question}</p>
                  {question.type === 'text' && <Input placeholder="Your answer" />}
                  {question.type === 'textarea' && <Textarea placeholder="Your answer" />}
                  {question.type === 'multiple-choice' && question.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input type="radio" id={option} name={question.id} value={option} />
                      <label htmlFor={option}>{option}</label>
                    </div>
                  ))}
                  {question.type === 'checkbox' && question.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input type="checkbox" id={option} name={question.id} value={option} />
                      <label htmlFor={option}>{option}</label>
                    </div>
                  ))}
                  {question.type === 'dropdown' && (
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options?.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
