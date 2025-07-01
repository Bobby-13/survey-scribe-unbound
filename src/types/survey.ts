
export interface Question {
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

export interface Section {
  id: string;
  title: string;
}

export interface BranchingRule {
  questionId: string;
  option: string;
  nextSectionId: string;
}

export const questionTypes = [
  { label: 'Text', value: 'text' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Multiple Choice', value: 'multiple-choice' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Dropdown', value: 'dropdown' },
  { label: 'Rating', value: 'rating' },
  { label: 'Date', value: 'date' },
] as const;
