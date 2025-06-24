
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  type: 'text' | 'longtext' | 'multiple_choice' | 'checkboxes' | 'dropdown' | 'rating' | 'date';
  text: string;
  description?: string;
  required: boolean;
  options?: string[];
  sectionId: string;
  branchingRules?: BranchingRule[];
  branchingLevel?: number;
  parentQuestionId?: string;
}

interface BranchingRule {
  id: string;
  condition: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'selected';
  value: string;
  action: 'show_question' | 'create_question' | 'show_section' | 'skip_to' | 'end_survey';
  targetQuestionId?: string;
  targetSectionId?: string;
  newQuestionText?: string;
  newQuestionType?: string;
}

interface Section {
  id: string;
  title: string;
  description?: string;
}

const SurveyTake = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock survey data - in real app, this would come from API
  const [survey, setSurvey] = useState({
    id: surveyId || '1',
    title: 'Employee Satisfaction Survey',
    description: 'Help us improve our workplace by sharing your thoughts and experiences.',
    sections: [
      { id: '1', title: 'General Questions', description: 'Basic information about your experience' },
      { id: '2', title: 'Work Environment', description: 'Questions about your workplace' }
    ] as Section[],
    questions: [
      {
        id: '1',
        type: 'text',
        text: 'What is your name?',
        required: true,
        sectionId: '1'
      },
      {
        id: '2',
        type: 'multiple_choice',
        text: 'How satisfied are you with your current role?',
        required: true,
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
        sectionId: '1'
      },
      {
        id: '3',
        type: 'rating',
        text: 'Rate your work-life balance',
        required: false,
        sectionId: '2'
      },
      {
        id: '4',
        type: 'longtext',
        text: 'What improvements would you suggest?',
        description: 'Please provide detailed feedback',
        required: false,
        sectionId: '2'
      }
    ] as Question[]
  });

  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentSectionData = survey.sections[currentSection];
  const currentQuestions = survey.questions.filter(q => q.sectionId === currentSectionData?.id);

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const validateCurrentSection = () => {
    const requiredQuestions = currentQuestions.filter(q => q.required);
    const missingResponses = requiredQuestions.filter(q => !responses[q.id] || responses[q.id] === '');
    
    if (missingResponses.length > 0) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentSection()) return;
    
    if (currentSection < survey.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentSection()) return;

    // Mock submission - in real app, this would send to API
    console.log('Survey responses:', responses);
    setIsSubmitted(true);
    
    toast({
      title: "Survey submitted successfully!",
      description: "Thank you for your feedback.",
    });
  };

  const renderQuestion = (question: Question) => {
    const value = responses[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
          />
        );

      case 'longtext':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Enter your detailed response..."
            rows={4}
          />
        );

      case 'multiple_choice':
        return (
          <RadioGroup
            value={value}
            onValueChange={(val) => handleResponseChange(question.id, val)}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkboxes':
        const checkboxValues = value || [];
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={checkboxValues.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleResponseChange(question.id, [...checkboxValues, option]);
                    } else {
                      handleResponseChange(question.id, checkboxValues.filter((v: string) => v !== option));
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <Select value={value} onValueChange={(val) => handleResponseChange(question.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'rating':
        return (
          <RadioGroup
            value={value?.toString()}
            onValueChange={(val) => handleResponseChange(question.id, parseInt(val))}
            className="flex space-x-4"
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <div key={rating} className="flex flex-col items-center space-y-2">
                <RadioGroupItem value={rating.toString()} id={`${question.id}-${rating}`} />
                <Label htmlFor={`${question.id}-${rating}`} className="text-sm">{rating}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Thank You!</CardTitle>
            <CardDescription>
              Your response has been submitted successfully. We appreciate your time and feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{survey.title}</h1>
          <p className="text-gray-600 text-lg">{survey.description}</p>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / survey.sections.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Section {currentSection + 1} of {survey.sections.length}
          </p>
        </div>

        {/* Current Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{currentSectionData?.title}</CardTitle>
            {currentSectionData?.description && (
              <CardDescription>{currentSectionData.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {currentQuestions.map((question) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-base font-medium">
                  {question.text}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {question.description && (
                  <p className="text-sm text-gray-600">{question.description}</p>
                )}
                {renderQuestion(question)}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <span className="text-sm text-gray-500">
            {currentSection + 1} / {survey.sections.length}
          </span>

          {currentSection === survey.sections.length - 1 ? (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Submit Survey
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyTake;
