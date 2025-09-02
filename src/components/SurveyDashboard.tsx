'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Download, Plus, Users, Home, MapPin } from 'lucide-react';
import { ExportOptions } from './ExportOptions';

interface SurveyDashboardProps {
  onBack: () => void;
}

export function SurveyDashboard({ onBack }: SurveyDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [surveys, setSurveys] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSurveys: 0,
    completedSurveys: 0,
    totalPeople: 0,
    uniqueClans: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { getAllSurveys, getStats } = await import('@/lib/database');

      const [surveysResult, statsResult] = await Promise.all([
        getAllSurveys(),
        getStats()
      ]);

      if (surveysResult.data) {
        setSurveys(surveysResult.data);
      }

      if (statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Survey Dashboard
                </h1>
                <p className="text-gray-600">
                  Manam Islanders Resettlement Program
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </Button>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Survey</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSurveys}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedSurveys} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total People</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPeople}</div>
              <p className="text-xs text-muted-foreground">
                Across all households
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clans Represented</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueClans}</div>
              <p className="text-xs text-muted-foreground">
                Different clan groups
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalSurveys > 0 ? Math.round((stats.completedSurveys / stats.totalSurveys) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Surveys completed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <ExportOptions surveys={surveys} />

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Survey Records</CardTitle>
            <CardDescription>
              View and manage collected survey data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by household head, clan, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>

            {/* Survey Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Household ID</th>
                    <th className="text-left p-3">Household Head</th>
                    <th className="text-left p-3">Clan</th>
                    <th className="text-left p-3">Current Location</th>
                    <th className="text-left p-3">Members</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        Loading surveys...
                      </td>
                    </tr>
                  ) : surveys.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        No surveys found. Start by creating a new survey.
                      </td>
                    </tr>
                  ) : (
                    surveys.map((survey) => (
                      <tr key={survey.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{survey.household_id}</td>
                        <td className="p-3">{survey.household_head}</td>
                        <td className="p-3">{survey.clan_name || 'N/A'}</td>
                        <td className="p-3">{survey.current_location || 'N/A'}</td>
                        <td className="p-3">{survey.household_size}</td>
                        <td className="p-3">{new Date(survey.created_at).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                            survey.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : survey.status === 'in_progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {survey.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Edit</Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
