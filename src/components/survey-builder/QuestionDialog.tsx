
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import { Question, questionTypes } from '@/types/survey';

interface QuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQuestion: Question | null;
  questionText: string;
  questionDescription: string;
  questionType: Question['type'];
  questionRequired: boolean;
  questionOptions: string[];
  onQuestionTextChange: (text: string) => void;
  onQuestionDescriptionChange: (description: string) => void;
  onQuestionTypeChange: (type: Question['type']) => void;
  onQuestionRequiredChange: (required: boolean) => void;
  onAddOption: () => void;
  onUpdateOption: (index: number, value: string) => void;
  onDeleteOption: (index: number) => void;
  onSubmit: () => void;
}

const QuestionDialog = ({
  isOpen,
  onClose,
  selectedQuestion,
  questionText,
  questionDescription,
  questionType,
  questionRequired,
  questionOptions,
  onQuestionTextChange,
  onQuestionDescriptionChange,
  onQuestionTypeChange,
  onQuestionRequiredChange,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
  onSubmit,
}: QuestionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedQuestion ? 'Edit Question' : 'Add Question'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="question">Question Text</Label>
            <Input
              id="question"
              value={questionText}
              onChange={(e) => onQuestionTextChange(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={questionDescription}
              onChange={(e) => onQuestionDescriptionChange(e.target.value)}
              placeholder="Optional: Add a more detailed explanation"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="type">Question Type</Label>
            <Select value={questionType} onValueChange={onQuestionTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(questionType === 'multiple-choice' || questionType === 'checkbox' || questionType === 'dropdown') && (
            <div>
              <Label>Options</Label>
              <div className="space-y-2">
                {questionOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={option}
                      onChange={(e) => onUpdateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => onDeleteOption(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={onAddOption}>
                  Add Option
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Label htmlFor="required">Required</Label>
            <Switch
              id="required"
              checked={questionRequired}
              onCheckedChange={onQuestionRequiredChange}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit}>
            {selectedQuestion ? 'Update Question' : 'Add Question'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionDialog;
