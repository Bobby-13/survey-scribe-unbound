
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Clock, Users, FileText, Search, Play } from 'lucide-react';

interface Survey {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  questions: number;
  responses: number;
  category: string;
  status: 'active' | 'closed';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const SurveyStart = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock survey data - in real app, this would come from API
  const [surveys] = useState<Survey[]>([
    {
      id: '1',
      title: 'Employee Satisfaction Survey',
      description: 'Help us improve our workplace by sharing your thoughts and experiences. This survey covers work environment, management, and career development.',
      estimatedTime: '5-7 minutes',
      questions: 12,
      responses: 45,
      category: 'Workplace',
      status: 'active',
      difficulty: 'Easy'
    },
    {
      id: '2',
      title: 'Training Effectiveness Assessment',
      description: 'Evaluate the effectiveness of our recent training programs and provide feedback for future improvements.',
      estimatedTime: '8-10 minutes',
      questions: 18,
      responses: 23,
      category: 'Training',
      status: 'active',
      difficulty: 'Medium'
    },
    {
      id: '3',
      title: 'Product Feedback Collection',
      description: 'Share your experience with our latest product features and help us make it even better.',
      estimatedTime: '3-5 minutes',
      questions: 8,
      responses: 67,
      category: 'Product',
      status: 'active',
      difficulty: 'Easy'
    },
    {
      id: '4',
      title: 'Customer Service Evaluation',
      description: 'Rate your recent customer service experience and help us improve our support quality.',
      estimatedTime: '4-6 minutes',
      questions: 10,
      responses: 89,
      category: 'Customer Service',
      status: 'closed',
      difficulty: 'Easy'
    },
    {
      id: '5',
      title: 'Market Research Survey',
      description: 'Comprehensive market research survey to understand consumer preferences and trends in our industry.',
      estimatedTime: '12-15 minutes',
      questions: 25,
      responses: 156,
      category: 'Research',
      status: 'active',
      difficulty: 'Hard'
    }
  ]);

  const filteredSurveys = surveys.filter(survey =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSurveys = filteredSurveys.filter(survey => survey.status === 'active');
  const closedSurveys = filteredSurveys.filter(survey => survey.status === 'closed');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Workplace': 'bg-blue-100 text-blue-800',
      'Training': 'bg-purple-100 text-purple-800',
      'Product': 'bg-orange-100 text-orange-800',
      'Customer Service': 'bg-teal-100 text-teal-800',
      'Research': 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const startSurvey = (surveyId: string) => {
    navigate(`/survey/${surveyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Survey Portal</h1>
                <p className="text-sm text-gray-600">Take surveys and share your feedback</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Stats */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search surveys by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">{activeSurveys.length}</CardTitle>
                <CardDescription className="text-blue-100">Active Surveys</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">
                  {surveys.reduce((sum, survey) => sum + survey.responses, 0)}
                </CardTitle>
                <CardDescription className="text-green-100">Total Responses</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold">
                  {Math.round(surveys.reduce((sum, survey) => sum + survey.questions, 0) / surveys.length)}
                </CardTitle>
                <CardDescription className="text-purple-100">Avg Questions</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Active Surveys */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Surveys</h2>
          
          {activeSurveys.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Active Surveys Found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Check back later for new surveys.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {activeSurveys.map((survey) => (
                <Card key={survey.id} className="group hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {survey.title}
                          </h3>
                          <Badge className={getCategoryColor(survey.category)}>
                            {survey.category}
                          </Badge>
                          <Badge className={getDifficultyColor(survey.difficulty)}>
                            {survey.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">{survey.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{survey.estimatedTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{survey.questions} questions</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{survey.responses} responses</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-6">
                        <Button 
                          onClick={() => startSurvey(survey.id)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Survey
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Closed Surveys */}
        {closedSurveys.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Closed Surveys</h2>
            <div className="grid gap-4">
              {closedSurveys.map((survey) => (
                <Card key={survey.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-700">{survey.title}</h3>
                          <Badge variant="secondary">Closed</Badge>
                          <Badge className={getCategoryColor(survey.category)}>
                            {survey.category}
                          </Badge>
                        </div>
                        <p className="text-gray-500 text-sm">{survey.description}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {survey.responses} responses collected
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyStart;
