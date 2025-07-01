
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Question, Section } from '@/types/survey';
import SidebarNavigation from '@/components/survey-builder/SidebarNavigation';
import SurveyBuilderHeader from '@/components/survey-builder/SurveyBuilderHeader';
import SurveyInfoCard from '@/components/survey-builder/SurveyInfoCard';
import SectionCard from '@/components/survey-builder/SectionCard';
import StatsSidebar from '@/components/survey-builder/StatsSidebar';
import QuestionDialog from '@/components/survey-builder/QuestionDialog';
import PreviewDialog from '@/components/survey-builder/PreviewDialog';

const SurveyBuilder = () => {
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

  const handleAddQuestion = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setShowQuestionDialog(true);
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
    resetQuestionForm();
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
    resetQuestionForm();
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(question => question.id !== questionId));
  };

  const resetQuestionForm = () => {
    setShowQuestionDialog(false);
    setSelectedQuestion(null);
    setNewQuestionText('');
    setNewQuestionDescription('');
    setNewQuestionOptions(['']);
    setNewQuestionRequired(false);
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

  const handleQuickAddQuestion = (type: string) => {
    setNewQuestionType(type as Question['type']);
    setSelectedSectionId('general');
    setShowQuestionDialog(true);
  };

  const saveSurvey = () => {
    alert('Survey saved!');
  };

  const handleQuestionSubmit = () => {
    if (selectedQuestion) {
      updateQuestion();
    } else {
      addQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarNavigation />

      <div className="flex-1 flex flex-col">
        <SurveyBuilderHeader 
          onPreview={() => setShowPreview(true)}
          onSave={saveSurvey}
        />

        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            <SurveyInfoCard
              title={surveyTitle}
              description={surveyDescription}
              onTitleChange={setSurveyTitle}
              onDescriptionChange={setSurveyDescription}
            />

            <div className="space-y-6">
              {sections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  questions={questions}
                  onDeleteSection={deleteSection}
                  onAddQuestion={handleAddQuestion}
                  onEditQuestion={editQuestion}
                  onDeleteQuestion={deleteQuestion}
                />
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

          <StatsSidebar
            sections={sections}
            questions={questions}
            onQuickAddQuestion={handleQuickAddQuestion}
          />
        </div>
      </div>

      <QuestionDialog
        isOpen={showQuestionDialog}
        onClose={resetQuestionForm}
        selectedQuestion={selectedQuestion}
        questionText={newQuestionText}
        questionDescription={newQuestionDescription}
        questionType={newQuestionType}
        questionRequired={newQuestionRequired}
        questionOptions={newQuestionOptions}
        onQuestionTextChange={setNewQuestionText}
        onQuestionDescriptionChange={setNewQuestionDescription}
        onQuestionTypeChange={setNewQuestionType}
        onQuestionRequiredChange={setNewQuestionRequired}
        onAddOption={addOption}
        onUpdateOption={updateOption}
        onDeleteOption={deleteOption}
        onSubmit={handleQuestionSubmit}
      />

      <PreviewDialog
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        surveyTitle={surveyTitle}
        surveyDescription={surveyDescription}
        sections={sections}
        questions={questions}
      />
    </div>
  );
};

export default SurveyBuilder;
