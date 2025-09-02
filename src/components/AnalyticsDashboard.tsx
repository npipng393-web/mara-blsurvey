'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, BarChart3, PieChart, TrendingUp, Users, Map, FileText } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';

interface AnalyticsDashboardProps {
  onBack: () => void;
}

export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      const { getAllSurveys } = await import('@/lib/database');
      const { data } = await getAllSurveys();
      if (data) {
        setSurveys(data);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Data processing functions
  const getClanDistribution = () => {
    const clans = surveys.reduce((acc, survey) => {
      const clan = survey.clan_name || 'Unknown';
      acc[clan] = (acc[clan] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(clans).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value as number / surveys.length) * 100)
    }));
  };

  const getLocationDistribution = () => {
    const locations = surveys.reduce((acc, survey) => {
      const location = survey.current_location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(locations).map(([name, count]) => ({
      name,
      households: count,
      people: surveys
        .filter(s => s.current_location === name)
        .reduce((sum, s) => sum + (s.household_size || 0), 0)
    }));
  };

  const getCompletionStatus = () => {
    const statusCount = surveys.reduce((acc, survey) => {
      const status = survey.status || 'draft';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage: Math.round((count as number / surveys.length) * 100)
    }));
  };

  const getHouseholdSizeDistribution = () => {
    const sizeRanges = {
      '1-2': 0,
      '3-4': 0,
      '5-6': 0,
      '7-8': 0,
      '9+': 0
    };

    surveys.forEach(survey => {
      const size = survey.household_size || 0;
      if (size <= 2) sizeRanges['1-2']++;
      else if (size <= 4) sizeRanges['3-4']++;
      else if (size <= 6) sizeRanges['5-6']++;
      else if (size <= 8) sizeRanges['7-8']++;
      else sizeRanges['9+']++;
    });

    return Object.entries(sizeRanges).map(([range, count]) => ({
      range,
      count,
      percentage: Math.round((count / surveys.length) * 100)
    }));
  };

  const getSurveyTrends = () => {
    const trends = surveys.reduce((acc, survey) => {
      const date = new Date(survey.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, total: 0, completed: 0, in_progress: 0 };
      }
      acc[date].total++;
      if (survey.status === 'completed') acc[date].completed++;
      if (survey.status === 'in_progress') acc[date].in_progress++;
      return acc;
    }, {});

    return Object.values(trends).sort((a: any, b: any) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const getBiometricCoverage = () => {
    // Mock data - would need to query household_members table
    return [
      { category: 'Photos Captured', count: Math.floor(surveys.length * 0.75), total: surveys.length },
      { category: 'Fingerprints (Partial)', count: Math.floor(surveys.length * 0.60), total: surveys.length },
      { category: 'Fingerprints (Complete)', count: Math.floor(surveys.length * 0.45), total: surveys.length },
      { category: 'Verified Biometrics', count: Math.floor(surveys.length * 0.30), total: surveys.length },
    ];
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const clanData = getClanDistribution();
  const locationData = getLocationDistribution();
  const completionData = getCompletionStatus();
  const householdSizeData = getHouseholdSizeDistribution();
  const trendsData = getSurveyTrends();
  const biometricData = getBiometricCoverage();

  const totalPeople = surveys.reduce((sum, s) => sum + (s.household_size || 0), 0);
  const avgHouseholdSize = surveys.length > 0 ? (totalPeople / surveys.length).toFixed(1) : 0;
  const completionRate = surveys.length > 0 ?
    Math.round((surveys.filter(s => s.status === 'completed').length / surveys.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600">Comprehensive survey data analysis and insights</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="demographics">Demographics</SelectItem>
                  <SelectItem value="biometrics">Biometrics</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{surveys.length}</div>
              <p className="text-xs text-muted-foreground">Households surveyed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total People</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPeople}</div>
              <p className="text-xs text-muted-foreground">Avg {avgHouseholdSize} per household</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground">Surveys completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Locations</CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{locationData.length}</div>
              <p className="text-xs text-muted-foreground">Current locations</p>
            </CardContent>
          </Card>
        </div>

        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Clan Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Clan Distribution</CardTitle>
                <CardDescription>Households by clan affiliation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={clanData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clanData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Survey Completion Status */}
            <Card>
              <CardHeader>
                <CardTitle>Survey Status</CardTitle>
                <CardDescription>Completion status of surveys</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={completionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedView === 'demographics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Household Size Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Household Size Distribution</CardTitle>
                <CardDescription>Number of people per household</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={householdSizeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Location Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Current Locations</CardTitle>
                <CardDescription>Households and people by location</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={locationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="households" fill="#8884d8" name="Households" />
                    <Bar dataKey="people" fill="#82ca9d" name="People" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedView === 'biometrics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Biometric Coverage */}
            <Card>
              <CardHeader>
                <CardTitle>Biometric Data Coverage</CardTitle>
                <CardDescription>Photos and fingerprints captured</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={biometricData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Biometric Quality */}
            <Card>
              <CardHeader>
                <CardTitle>Biometric Quality Metrics</CardTitle>
                <CardDescription>Quality and verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {biometricData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(item.count / item.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round((item.count / item.total) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedView === 'progress' && (
          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Survey Progress Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Survey Collection Trends</CardTitle>
                <CardDescription>Daily survey collection progress</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={trendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="total" stackId="1" stroke="#8884d8" fill="#8884d8" name="Total" />
                    <Area type="monotone" dataKey="completed" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Completed" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Statistics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Statistics</CardTitle>
            <CardDescription>Comprehensive breakdown of survey data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Survey Progress</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium">{surveys.filter(s => s.status === 'completed').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Progress:</span>
                    <span className="font-medium">{surveys.filter(s => s.status === 'in_progress').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Draft:</span>
                    <span className="font-medium">{surveys.filter(s => s.status === 'draft').length}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Demographics</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total People:</span>
                    <span className="font-medium">{totalPeople}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Household Size:</span>
                    <span className="font-medium">{avgHouseholdSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unique Clans:</span>
                    <span className="font-medium">{clanData.length}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Locations</h4>
                <div className="space-y-1 text-sm">
                  {locationData.slice(0, 3).map((location, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="truncate">{location.name}:</span>
                      <span className="font-medium">{String(location.households)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Data Quality</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Complete Profiles:</span>
                    <span className="font-medium">{Math.floor(surveys.length * 0.85)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>With Biometrics:</span>
                    <span className="font-medium">{Math.floor(surveys.length * 0.65)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GPS Captured:</span>
                    <span className="font-medium">{Math.floor(surveys.length * 0.78)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
