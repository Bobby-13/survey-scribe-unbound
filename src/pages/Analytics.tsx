
import React, { useState } from 'react';
import { ArrowLeft, Download, Filter, Calendar, TrendingUp, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Analytics = () => {
  const navigate = useNavigate();
  const [selectedSurvey, setSelectedSurvey] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');

  // Sample data
  const responseData = [
    { name: 'Week 1', responses: 24 },
    { name: 'Week 2', responses: 35 },
    { name: 'Week 3', responses: 18 },
    { name: 'Week 4', responses: 42 },
  ];

  const questionData = [
    { question: 'Q1: Overall Satisfaction', avg: 4.2, responses: 87 },
    { question: 'Q2: Product Quality', avg: 3.8, responses: 85 },
    { question: 'Q3: Customer Service', avg: 4.5, responses: 82 },
    { question: 'Q4: Value for Money', avg: 3.9, responses: 84 },
  ];

  const satisfactionData = [
    { name: 'Very Satisfied', value: 35, color: '#10B981' },
    { name: 'Satisfied', value: 40, color: '#3B82F6' },
    { name: 'Neutral', value: 15, color: '#F59E0B' },
    { name: 'Dissatisfied', value: 8, color: '#EF4444' },
    { name: 'Very Dissatisfied', value: 2, color: '#DC2626' },
  ];

  const completionData = [
    { date: '2024-01-01', rate: 85 },
    { date: '2024-01-08', rate: 88 },
    { date: '2024-01-15', rate: 82 },
    { date: '2024-01-22', rate: 91 },
    { date: '2024-01-29', rate: 89 },
  ];

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
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">Survey insights and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select Survey" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Surveys</SelectItem>
              <SelectItem value="1">Employee Satisfaction Survey</SelectItem>
              <SelectItem value="2">Training Effectiveness</SelectItem>
              <SelectItem value="3">Product Feedback</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Total Responses</CardTitle>
                <Users className="w-6 h-6 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">1,247</div>
              <div className="flex items-center text-blue-100">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Completion Rate</CardTitle>
                <Target className="w-6 h-6 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">87.3%</div>
              <div className="flex items-center text-green-100">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+3.2% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Average Rating</CardTitle>
                <TrendingUp className="w-6 h-6 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">4.2/5</div>
              <div className="flex items-center text-purple-100">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+0.3 from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Active Surveys</CardTitle>
                <Calendar className="w-6 h-6 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">8</div>
              <div className="flex items-center text-orange-100">
                <span className="text-sm">2 ending this week</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Response Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Response Trends</CardTitle>
              <CardDescription>Weekly response volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={responseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="responses" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Satisfaction Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Satisfaction Distribution</CardTitle>
              <CardDescription>Overall satisfaction levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Full Width Charts */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Completion Rate Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate Trend</CardTitle>
              <CardDescription>Survey completion rates over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Question Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Question Performance</CardTitle>
              <CardDescription>Average ratings by question</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.question}</h4>
                      <p className="text-sm text-gray-600">{item.responses} responses</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(item.avg / 5) * 100}%` }}
                        ></div>
                      </div>
                      <Badge variant="outline" className="min-w-[60px] justify-center">
                        {item.avg}/5
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Survey Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Survey Performance Summary</CardTitle>
            <CardDescription>Detailed performance metrics for all surveys</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Survey</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Responses</th>
                    <th className="text-left py-3 px-4 font-medium">Completion Rate</th>
                    <th className="text-left py-3 px-4 font-medium">Avg. Rating</th>
                    <th className="text-left py-3 px-4 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Employee Satisfaction Survey</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </td>
                    <td className="py-3 px-4">287</td>
                    <td className="py-3 px-4">89.2%</td>
                    <td className="py-3 px-4">4.3/5</td>
                    <td className="py-3 px-4">Jan 15, 2024</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Training Effectiveness</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
                    </td>
                    <td className="py-3 px-4">0</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">-</td>
                    <td className="py-3 px-4">Jan 20, 2024</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Product Feedback Collection</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-gray-100 text-gray-800">Closed</Badge>
                    </td>
                    <td className="py-3 px-4">456</td>
                    <td className="py-3 px-4">92.1%</td>
                    <td className="py-3 px-4">4.1/5</td>
                    <td className="py-3 px-4">Jan 10, 2024</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
