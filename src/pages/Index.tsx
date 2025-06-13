
import React, { useState } from 'react';
import { Plus, BarChart3, Users, Settings, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([
    {
      id: '1',
      title: 'Employee Satisfaction Survey',
      description: 'Annual employee satisfaction and engagement survey',
      status: 'active',
      responses: 45,
      created: '2024-01-15',
      type: 'feedback'
    },
    {
      id: '2',
      title: 'Training Effectiveness Assessment',
      description: 'Post-training feedback and effectiveness measurement',
      status: 'draft',
      responses: 0,
      created: '2024-01-20',
      type: 'assessment'
    },
    {
      id: '3',
      title: 'Product Feedback Collection',
      description: 'Customer feedback on new product features',
      status: 'closed',
      responses: 128,
      created: '2024-01-10',
      type: 'feedback'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SurveyPro</h1>
                <p className="text-sm text-gray-600">Professional Survey Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Users
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">12</CardTitle>
              <CardDescription className="text-blue-100">Total Surveys</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">287</CardTitle>
              <CardDescription className="text-green-100">Total Responses</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">5</CardTitle>
              <CardDescription className="text-purple-100">Active Surveys</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold">92%</CardTitle>
              <CardDescription className="text-orange-100">Completion Rate</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={() => navigate('/survey-builder')} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Survey
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/analytics')}
            className="px-6 py-3 rounded-lg border-2 hover:bg-gray-50 transition-all duration-200"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            View Analytics
          </Button>
        </div>

        {/* Surveys List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Surveys</h2>
          
          {surveys.map((survey) => (
            <Card key={survey.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {survey.title}
                      </h3>
                      <Badge className={getStatusColor(survey.status)}>
                        {survey.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{survey.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>Created: {survey.created}</span>
                      <span>{survey.responses} responses</span>
                      <span>Type: {survey.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Quick Survey</CardTitle>
              <CardDescription>
                Create a survey from our pre-built templates in minutes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Analytics Hub</CardTitle>
              <CardDescription>
                View comprehensive analytics and insights from all your surveys
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Manage team access and collaboration on your survey projects
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
