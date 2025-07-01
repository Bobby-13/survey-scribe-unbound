import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  Save,
  FileText,
  Users,
  Clock,
  Settings,
  Home,
  BarChart3,
  BookOpen,
  Calendar,
  User
} from 'lucide-react';

interface Question {
  id: string;
  sectionId: string;
  question: string;
  description?: string;
  type: 'text' | 'textarea' | 'multiple-choice' | 'checkbox' | 'dropdown' | 'rating' | 'date';
  options?: string[];
  required: boolean;
  branchingRules: BranchingRule[];
  isBranched: boolean;
}

interface Section {
  id: string;
  title: string;
}

interface BranchingRule {
  questionId: string;
  option: string;
  nextSectionId: string;
}

const questionTypes = [
  { label: 'Text', value: 'text' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Multiple Choice', value: 'multiple-choice' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Dropdown', value: 'dropdown' },
  { label: 'Rating', value: 'rating' },
  { label: 'Date', value: 'date' },
];

const SurveyBuilder = () => {
  const navigate = useNavigate();
  const [surveyTitle, setSurveyTitle] = useState('Untitled Survey');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [sections, setSections] = useState<Section[]>([
    { id: 'general', title: 'General Questions' },
  ]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState('general');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState<Question['type']>('text');
  const [newQuestionRequired, setNewQuestionRequired] = useState(false);
  const [newQuestionOptions, setNewQuestionOptions] = useState(['']);
  const [showPreview, setShowPreview] = useState(false);
  const [newQuestionDescription, setNewQuestionDescription] = useState('');

  const addSection = () => {
    const newSectionId = Math.random().toString(36).substring(7);
    setSections([...sections, { id: newSectionId, title: 'New Section' }]);
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
    setQuestions(questions.filter(question => question.sectionId !== sectionId));
  };

  const addQuestion = () => {
    if (!newQuestionText) return;

    const newQuestion: Question = {
      id: Math.random().toString(36).substring(7),
      sectionId: selectedSectionId,
      question: newQuestionText,
      description: newQuestionDescription,
      type: newQuestionType,
      options: newQuestionType === 'multiple-choice' || newQuestionType === 'checkbox' || newQuestionType === 'dropdown' ? newQuestionOptions : [],
      required: newQuestionRequired,
      branchingRules: [],
      isBranched: false,
    };

    setQuestions([...questions, newQuestion]);
    setShowQuestionDialog(false);
    setNewQuestionText('');
    setNewQuestionDescription('');
    setNewQuestionOptions(['']);
    setNewQuestionRequired(false);
  };

  const editQuestion = (questionId: string) => {
    const questionToEdit = questions.find(q => q.id === questionId);
    if (questionToEdit) {
      setSelectedQuestion(questionToEdit);
      setSelectedSectionId(questionToEdit.sectionId);
      setNewQuestionText(questionToEdit.question);
      setNewQuestionDescription(questionToEdit.description || '');
      setNewQuestionType(questionToEdit.type);
      setNewQuestionOptions(questionToEdit.options || ['']);
      setNewQuestionRequired(questionToEdit.required);
      setShowQuestionDialog(true);
    }
  };

  const updateQuestion = () => {
    if (!selectedQuestion) return;

    const updatedQuestion: Question = {
      ...selectedQuestion,
      sectionId: selectedSectionId,
      question: newQuestionText,
      description: newQuestionDescription,
      type: newQuestionType,
      options: newQuestionType === 'multiple-choice' || newQuestionType === 'checkbox' || newQuestionType === 'dropdown' ? newQuestionOptions : [],
      required: newQuestionRequired,
    };

    setQuestions(questions.map(q => q.id === selectedQuestion.id ? updatedQuestion : q));
    setShowQuestionDialog(false);
    setSelectedQuestion(null);
    setNewQuestionText('');
    setNewQuestionDescription('');
    setNewQuestionOptions(['']);
    setNewQuestionRequired(false);
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(question => question.id !== questionId));
  };

  const addOption = () => {
    setNewQuestionOptions([...newQuestionOptions, '']);
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...newQuestionOptions];
    updatedOptions[index] = value;
    setNewQuestionOptions(updatedOptions);
  };

  const deleteOption = (index: number) => {
    const updatedOptions = [...newQuestionOptions];
    updatedOptions.splice(index, 1);
    setNewQuestionOptions(updatedOptions);
  };

  const setSelectedQuestionType = (type: Question['type']) => {
    setNewQuestionType(type);
  };

  const saveSurvey = () => {
    // Placeholder for save functionality
    alert('Survey saved!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
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
                onClick={() => setShowPreview(true)}
                variant="outline"
                className="border-gray-300"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={saveSurvey}
                className="bg-red-600 hover:bg-red-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex">
          {/* Main Survey Builder */}
          <div className="flex-1 p-6">
            {/* Survey Info Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Survey Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Survey Title</Label>
                  <Input
                    id="title"
                    value={surveyTitle}
                    onChange={(e) => setSurveyTitle(e.target.value)}
                    placeholder="Enter survey title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={surveyDescription}
                    onChange={(e) => setSurveyDescription(e.target.value)}
                    placeholder="Enter survey description"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sections */}
            <div className="space-y-6">
              {sections.map((section) => (
                <Card key={section.id} className="border-gray-200">
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          {questions.filter(q => q.sectionId === section.id && !q.isBranched).length} Questions
                        </Badge>
                        {section.id !== 'general' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteSection(section.id)}
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
                      {questions
                        .filter(q => q.sectionId === section.id && !q.isBranched)
                        .map((question, index) => (
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
                                  onClick={() => editQuestion(question.id)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Settings className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteQuestion(question.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      
                      <Button
                        onClick={() => {
                          setSelectedSectionId(section.id);
                          setShowQuestionDialog(true);
                        }}
                        variant="outline"
                        className="w-full border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                onClick={addSection}
                variant="outline"
                className="w-full border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          </div>

          {/* Right Sidebar - Survey Stats */}
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

            {/* Quick Add Question Types */}
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
                      onClick={() => {
                        setSelectedQuestionType(questionType.type as any);
                        setSelectedSectionId('general');
                        setShowQuestionDialog(true);
                      }}
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
        </div>
      </div>

      {/* Question Dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedQuestion ? 'Edit Question' : 'Add Question'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="question">Question Text</Label>
              <Input
                id="question"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newQuestionDescription}
                onChange={(e) => setNewQuestionDescription(e.target.value)}
                placeholder="Optional: Add a more detailed explanation"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="type">Question Type</Label>
              <Select value={newQuestionType} onValueChange={(value) => setNewQuestionType(value as Question['type'])}>
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

            {(newQuestionType === 'multiple-choice' || newQuestionType === 'checkbox' || newQuestionType === 'dropdown') && (
              <div>
                <Label>Options</Label>
                <div className="space-y-2">
                  {newQuestionOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button type="button" variant="ghost" size="sm" onClick={() => deleteOption(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Label htmlFor="required">Required</Label>
              <Switch
                id="required"
                checked={newQuestionRequired}
                onCheckedChange={(checked) => setNewQuestionRequired(checked)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setShowQuestionDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={selectedQuestion ? updateQuestion : addQuestion}>
              {selectedQuestion ? 'Update Question' : 'Add Question'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
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
    </div>
  );
};

export default SurveyBuilder;
