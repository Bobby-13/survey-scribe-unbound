import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, GripVertical, Eye, Save, Settings, ChevronDown, ChevronRight, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface BranchingRule {
  id: string;
  condition: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'selected';
  value: string | number;
  targetQuestionId?: string;
  targetSectionId?: string;
  action: 'show_question' | 'show_section' | 'skip_to' | 'end_survey' | 'create_question';
  newQuestionData?: Partial<Question>; // For storing new question details
}

interface Question {
  id: string;
  type: 'text' | 'textarea' | 'multiple_choice' | 'checkbox' | 'dropdown' | 'rating' | 'date';
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  sectionId: string;
  branchingRules?: BranchingRule[];
  parentQuestionId?: string; // Track which question this branched from
  branchingLevel?: number; // Track nesting level for UI
}

interface Section {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  isCollapsed?: boolean;
}

interface NewQuestionForm {
  title: string;
  description: string;
  type: Question['type'];
  required: boolean;
  sectionId: string;
  options: string[];
}

const SurveyBuilder = () => {
  const navigate = useNavigate();
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [sections, setSections] = useState<Section[]>([
    { id: 'default', title: 'General Questions', orderIndex: 0, isCollapsed: false }
  ]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState<Question['type']>('text');
  const [selectedSectionId, setSelectedSectionId] = useState('default');
  const [newQuestionDialogOpen, setNewQuestionDialogOpen] = useState(false);
  const [currentBranchingContext, setCurrentBranchingContext] = useState<{
    questionId: string;
    ruleId: string;
  } | null>(null);
  const [newQuestionForm, setNewQuestionForm] = useState<NewQuestionForm>({
    title: '',
    description: '',
    type: 'text',
    required: false,
    sectionId: 'default',
    options: ['Option 1', 'Option 2']
  });

  const questionTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'rating', label: 'Rating Scale' },
    { value: 'date', label: 'Date Picker' }
  ];

  const branchingConditions = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'selected', label: 'Option Selected' }
  ];

  const branchingActions = [
    { value: 'show_question', label: 'Show Existing Question' },
    { value: 'create_question', label: 'Create New Question' },
    { value: 'show_section', label: 'Show Section' },
    { value: 'skip_to', label: 'Skip To' },
    { value: 'end_survey', label: 'End Survey' }
  ];

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: 'New Section',
      orderIndex: sections.length,
      isCollapsed: false
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSection = (id: string) => {
    if (id === 'default') return; // Don't allow deleting default section
    
    // Move questions from deleted section to default
    setQuestions(questions.map(q => 
      q.sectionId === id ? { ...q, sectionId: 'default' } : q
    ));
    setSections(sections.filter(s => s.id !== id));
  };

  const toggleSectionCollapse = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, isCollapsed: !s.isCollapsed } : s
    ));
  };

  const addQuestion = (branchingContext?: { questionId: string; ruleId: string }) => {
    const parentQuestion = branchingContext ? questions.find(q => q.id === branchingContext.questionId) : null;
    const branchingLevel = parentQuestion ? (parentQuestion.branchingLevel || 0) + 1 : 0;
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: selectedQuestionType,
      title: branchingContext ? 'New Branched Question' : 'New Question',
      required: false,
      sectionId: selectedSectionId,
      options: ['multiple_choice', 'checkbox', 'dropdown'].includes(selectedQuestionType) 
        ? ['Option 1', 'Option 2'] 
        : undefined,
      branchingRules: [],
      parentQuestionId: branchingContext?.questionId,
      branchingLevel
    };
    
    setQuestions([...questions, newQuestion]);

    // If this was created from branching, update the rule
    if (branchingContext) {
      updateBranchingRule(
        branchingContext.questionId, 
        branchingContext.ruleId, 
        { 
          targetQuestionId: newQuestion.id,
          newQuestionData: newQuestion
        }
      );
      setNewQuestionDialogOpen(false);
      setCurrentBranchingContext(null);
      resetNewQuestionForm();
    }

    return newQuestion.id;
  };

  const createQuestionFromForm = () => {
    if (!currentBranchingContext) return;

    const parentQuestion = questions.find(q => q.id === currentBranchingContext.questionId);
    const branchingLevel = parentQuestion ? (parentQuestion.branchingLevel || 0) + 1 : 0;
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: newQuestionForm.type,
      title: newQuestionForm.title || 'New Branched Question',
      description: newQuestionForm.description,
      required: newQuestionForm.required,
      sectionId: newQuestionForm.sectionId,
      options: ['multiple_choice', 'checkbox', 'dropdown'].includes(newQuestionForm.type) 
        ? newQuestionForm.options.filter(opt => opt.trim() !== '')
        : undefined,
      branchingRules: [],
      parentQuestionId: currentBranchingContext.questionId,
      branchingLevel
    };
    
    setQuestions([...questions, newQuestion]);

    // Update the branching rule
    updateBranchingRule(
      currentBranchingContext.questionId, 
      currentBranchingContext.ruleId, 
      { 
        targetQuestionId: newQuestion.id,
        newQuestionData: newQuestion
      }
    );

    setNewQuestionDialogOpen(false);
    setCurrentBranchingContext(null);
    resetNewQuestionForm();
  };

  const resetNewQuestionForm = () => {
    setNewQuestionForm({
      title: '',
      description: '',
      type: 'text',
      required: false,
      sectionId: 'default',
      options: ['Option 1', 'Option 2']
    });
  };

  const updateNewQuestionForm = (updates: Partial<NewQuestionForm>) => {
    setNewQuestionForm(prev => ({ ...prev, ...updates }));
  };

  const addOptionToNewQuestion = () => {
    const newOptions = [...newQuestionForm.options, `Option ${newQuestionForm.options.length + 1}`];
    updateNewQuestionForm({ options: newOptions });
  };

  const updateNewQuestionOption = (index: number, value: string) => {
    const newOptions = [...newQuestionForm.options];
    newOptions[index] = value;
    updateNewQuestionForm({ options: newOptions });
  };

  const removeNewQuestionOption = (index: number) => {
    if (newQuestionForm.options.length > 1) {
      const newOptions = newQuestionForm.options.filter((_, i) => i !== index);
      updateNewQuestionForm({ options: newOptions });
    }
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    // Also remove any branching rules that target this question
    const updatedQuestions = questions
      .filter(q => q.id !== id)
      .map(q => ({
        ...q,
        branchingRules: q.branchingRules?.filter(rule => rule.targetQuestionId !== id)
      }));
    setQuestions(updatedQuestions);
  };

  const addBranchingRule = (questionId: string) => {
    const newRule: BranchingRule = {
      id: Date.now().toString(),
      condition: 'equals',
      value: '',
      action: 'show_question'
    };
    
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const updatedRules = [...(question.branchingRules || []), newRule];
      updateQuestion(questionId, { branchingRules: updatedRules });
    }
  };

  const updateBranchingRule = (questionId: string, ruleId: string, updates: Partial<BranchingRule>) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.branchingRules) {
      const updatedRules = question.branchingRules.map(rule =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      );
      updateQuestion(questionId, { branchingRules: updatedRules });
    }
  };

  const deleteBranchingRule = (questionId: string, ruleId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.branchingRules) {
      const ruleToDelete = question.branchingRules.find(rule => rule.id === ruleId);
      
      // If the rule created a question, ask if they want to delete that too
      if (ruleToDelete && ruleToDelete.targetQuestionId && ruleToDelete.action === 'create_question') {
        const shouldDeleteTargetQuestion = window.confirm(
          'This rule created a new question. Do you want to delete that question too?'
        );
        if (shouldDeleteTargetQuestion) {
          deleteQuestion(ruleToDelete.targetQuestionId);
        }
      }

      const updatedRules = question.branchingRules.filter(rule => rule.id !== ruleId);
      updateQuestion(questionId, { branchingRules: updatedRules });
    }
  };

  const handleCreateNewQuestionFromBranching = (questionId: string, ruleId: string) => {
    setCurrentBranchingContext({ questionId, ruleId });
    
    // Set default section to same as parent question
    const parentQuestion = questions.find(q => q.id === questionId);
    if (parentQuestion) {
      updateNewQuestionForm({ sectionId: parentQuestion.sectionId });
    }
    
    setNewQuestionDialogOpen(true);
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      updateQuestion(questionId, {
        options: [...question.options, `Option ${question.options.length + 1}`]
      });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question && question.options && question.options.length > 1) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleQuestionTypeChange = (questionId: string, value: string) => {
    const questionType = value as Question['type'];
    const updates: Partial<Question> = { type: questionType };
    
    // Add default options for option-based question types
    if (['multiple_choice', 'checkbox', 'dropdown'].includes(questionType)) {
      updates.options = ['Option 1', 'Option 2'];
    } else {
      updates.options = undefined;
    }
    
    updateQuestion(questionId, updates);
  };

  const handleSelectedQuestionTypeChange = (value: string) => {
    const questionType = value as Question['type'];
    setSelectedQuestionType(questionType);
  };

  const getQuestionsForSection = (sectionId: string) => {
    return questions
      .filter(q => q.sectionId === sectionId)
      .sort((a, b) => (a.branchingLevel || 0) - (b.branchingLevel || 0)); // Sort by branching level
  };

  const getAvailableTargets = (currentQuestionId: string) => {
    const allQuestions = questions.filter(q => q.id !== currentQuestionId);
    return {
      questions: allQuestions,
      sections: sections
    };
  };

  const renderBranchingRuleTargetSelector = (question: Question, rule: BranchingRule) => {
    if (rule.action === 'create_question') {
      return (
        <div>
          <label className="text-xs font-medium text-gray-600">New Question</label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCreateNewQuestionFromBranching(question.id, rule.id)}
            className="w-full h-8 text-blue-600 border-blue-300"
          >
            <Plus className="w-3 h-3 mr-1" />
            Create Question
          </Button>
          {rule.targetQuestionId && (
            <div className="mt-1 text-xs text-green-600">
              ✓ Question created: {questions.find(q => q.id === rule.targetQuestionId)?.title}
            </div>
          )}
        </div>
      );
    }

    if (rule.action === 'show_question' || rule.action === 'skip_to') {
      return (
        <div>
          <label className="text-xs font-medium text-gray-600">Target Question</label>
          <Select
            value={rule.targetQuestionId || ''}
            onValueChange={(value) => updateBranchingRule(question.id, rule.id, { targetQuestionId: value })}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select question" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableTargets(question.id).questions.map(q => (
                <SelectItem key={q.id} value={q.id}>
                  {q.title} {q.branchingLevel ? `(Level ${q.branchingLevel})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (rule.action === 'show_section') {
      return (
        <div>
          <label className="text-xs font-medium text-gray-600">Target Section</label>
          <Select
            value={rule.targetSectionId || ''}
            onValueChange={(value) => updateBranchingRule(question.id, rule.id, { targetSectionId: value })}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map(s => (
                <SelectItem key={s.id} value={s.id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return null;
  };

  const renderBranchingRules = (question: Question) => {
    if (!question.branchingRules || question.branchingRules.length === 0) {
      return null;
    }

    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4 text-blue-600" />
            <h4 className="font-medium text-blue-900">Branching Logic</h4>
            {question.branchingLevel && question.branchingLevel > 0 && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Level {question.branchingLevel}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addBranchingRule(question.id)}
            className="text-blue-600 border-blue-300"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Rule
          </Button>
        </div>

        <div className="space-y-3">
          {question.branchingRules.map((rule, index) => (
            <div key={rule.id} className="p-3 bg-white rounded border">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">If response</label>
                  <Select
                    value={rule.condition}
                    onValueChange={(value) => updateBranchingRule(question.id, rule.id, { condition: value as BranchingRule['condition'] })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {branchingConditions.map(condition => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Value</label>
                  {question.type === 'multiple_choice' && question.options ? (
                    <Select
                      value={rule.value.toString()}
                      onValueChange={(value) => updateBranchingRule(question.id, rule.id, { value })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options.map((option, idx) => (
                          <SelectItem key={idx} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={rule.value.toString()}
                      onChange={(e) => updateBranchingRule(question.id, rule.id, { value: e.target.value })}
                      placeholder="Enter value"
                      className="h-8"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Then</label>
                  <Select
                    value={rule.action}
                    onValueChange={(value) => updateBranchingRule(question.id, rule.id, { action: value as BranchingRule['action'] })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {branchingActions.map(action => (
                        <SelectItem key={action.value} value={action.value}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {renderBranchingRuleTargetSelector(question, rule)}
              </div>

              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteBranchingRule(question.id, rule.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderQuestionEditor = (question: Question) => {
    const indentLevel = question.branchingLevel || 0;
    const marginLeft = indentLevel * 20;

    return (
      <Card 
        key={question.id} 
        className={`mb-4 border-2 hover:border-blue-300 transition-colors ${
          indentLevel > 0 ? 'border-l-4 border-l-purple-400' : ''
        }`}
        style={{ marginLeft: `${marginLeft}px` }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
              <Badge variant="outline">{questionTypes.find(t => t.value === question.type)?.label}</Badge>
              {question.branchingLevel && question.branchingLevel > 0 && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Branched (L{question.branchingLevel})
                </Badge>
              )}
              {question.branchingRules && question.branchingRules.length > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <GitBranch className="w-3 h-3 mr-1" />
                  {question.branchingRules.length} rules
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuestion(question.id, { required: !question.required })}
                className={question.required ? 'bg-red-50 border-red-200' : ''}
              >
                {question.required ? 'Required' : 'Optional'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addBranchingRule(question.id)}
                className="text-blue-600 hover:bg-blue-50"
              >
                <GitBranch className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteQuestion(question.id)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Question title"
                value={question.title}
                onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                className="text-lg font-medium"
              />
            </div>
            
            <div>
              <Input
                placeholder="Question description (optional)"
                value={question.description || ''}
                onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Question Type:</label>
                <Select 
                  value={question.type} 
                  onValueChange={(value) => handleQuestionTypeChange(question.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Section:</label>
                <Select 
                  value={question.sectionId} 
                  onValueChange={(value) => updateQuestion(question.id, { sectionId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map(section => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Options for multiple choice, checkbox, dropdown */}
            {question.options && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Options:</label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addOption(question.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(question.id, index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(question.id, index)}
                      disabled={question.options!.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Rating scale preview */}
            {question.type === 'rating' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button key={num} className="w-8 h-8 border rounded-full hover:bg-blue-100 transition-colors">
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Branching Rules */}
            {renderBranchingRules(question)}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSection = (section: Section) => {
    const sectionQuestions = getQuestionsForSection(section.id);
    
    return (
      <div key={section.id} className="mb-6">
        <Card className="border-l-4 border-l-purple-500">
          <Collapsible 
            open={!section.isCollapsed}
            onOpenChange={() => toggleSectionCollapse(section.id)}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {section.isCollapsed ? 
                      <ChevronRight className="w-5 h-5 text-gray-500" /> : 
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    }
                    <div>
                      <CardTitle className="text-lg text-purple-700">{section.title}</CardTitle>
                      {section.description && (
                        <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{sectionQuestions.length} questions</Badge>
                    {section.id !== 'default' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Section title"
                    value={section.title}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    className="font-medium"
                  />
                  <Input
                    placeholder="Section description (optional)"
                    value={section.description || ''}
                    onChange={(e) => updateSection(section.id, { description: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  {sectionQuestions.map(renderQuestionEditor)}
                  
                  {sectionQuestions.length === 0 && (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500 mb-4">No questions in this section</p>
                      <p className="text-sm text-gray-400">Click "Add Question" to organize your questions</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Survey Builder</h1>
                <p className="text-sm text-gray-600">Create and customize your survey with sections & branching</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Survey
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-3">
            {/* Survey Header */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Survey Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Survey Title</label>
                  <Input
                    placeholder="Enter survey title"
                    value={surveyTitle}
                    onChange={(e) => setSurveyTitle(e.target.value)}
                    className="text-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Survey Description</label>
                  <Textarea
                    placeholder="Describe the purpose of your survey"
                    value={surveyDescription}
                    onChange={(e) => setSurveyDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Survey Sections</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={addSection}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Section
                  </Button>
                  <span className="text-sm text-gray-500">{sections.length} sections, {questions.length} questions</span>
                </div>
              </div>
              
              {sections.map(renderSection)}

              {sections.length === 0 && (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500 mb-4">No sections created yet</p>
                    <p className="text-sm text-gray-400">Click "Add Section" to organize your questions</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Add Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Target Section</label>
                  <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map(section => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Question Type</label>
                  <Select value={selectedQuestionType} onValueChange={handleSelectedQuestionTypeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={() => addQuestion()} 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>

                <div className="pt-4 border-t">
                  <h3 className="font-medium text-gray-900 mb-3">Survey Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sections:</span>
                      <span className="font-medium">{sections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-medium">{questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Required:</span>
                      <span className="font-medium">{questions.filter(q => q.required).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">With Branching:</span>
                      <span className="font-medium">{questions.filter(q => q.branchingRules && q.branchingRules.length > 0).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Branched Questions:</span>
                      <span className="font-medium">{questions.filter(q => q.parentQuestionId).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated time:</span>
                      <span className="font-medium">{Math.max(1, Math.ceil(questions.length * 0.5))} min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced New Question Dialog for Branching */}
      <Dialog open={newQuestionDialogOpen} onOpenChange={setNewQuestionDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Branched Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Question Title *</label>
              <Input
                value={newQuestionForm.title}
                onChange={(e) => updateNewQuestionForm({ title: e.target.value })}
                placeholder="Enter question title"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Question Description</label>
              <Textarea
                value={newQuestionForm.description}
                onChange={(e) => updateNewQuestionForm({ description: e.target.value })}
                placeholder="Optional description for the question"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Question Type</label>
                <Select 
                  value={newQuestionForm.type} 
                  onValueChange={(value: Question['type']) => {
                    const updates: Partial<NewQuestionForm> = { type: value };
                    if (['multiple_choice', 'checkbox', 'dropdown'].includes(value)) {
                      updates.options = ['Option 1', 'Option 2'];
                    }
                    updateNewQuestionForm(updates);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Section</label>
                <Select 
                  value={newQuestionForm.sectionId} 
                  onValueChange={(value) => updateNewQuestionForm({ sectionId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map(section => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="required"
                checked={newQuestionForm.required}
                onChange={(e) => updateNewQuestionForm({ required: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="required" className="text-sm font-medium text-gray-700">
                Required question
              </label>
            </div>

            {/* Options for multiple choice, checkbox, dropdown */}
            {['multiple_choice', 'checkbox', 'dropdown'].includes(newQuestionForm.type) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Answer Options:</label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addOptionToNewQuestion}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                {newQuestionForm.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => updateNewQuestionOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeNewQuestionOption(index)}
                      disabled={newQuestionForm.options.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Rating scale preview */}
            {newQuestionForm.type === 'rating' && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Preview:</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button key={num} className="w-8 h-8 border rounded-full hover:bg-blue-100 transition-colors">
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setNewQuestionDialogOpen(false);
                  setCurrentBranchingContext(null);
                  resetNewQuestionForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={createQuestionFromForm}
                disabled={!newQuestionForm.title.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Question
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SurveyBuilder;
