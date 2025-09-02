'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, BookOpen, Award, Plus, Trash2 } from 'lucide-react';
import { SurveyFormData, EducationYouth } from '@/lib/types';

interface EducationFormProps {
  data: SurveyFormData;
  onUpdate: (data: Partial<SurveyFormData>) => void;
}

export function EducationForm({ data, onUpdate }: EducationFormProps) {
  const [educationYouth, setEducationYouth] = useState<EducationYouth>({
    schoolAttendance: data.educationYouth?.schoolAttendance || {
      childrenInSchool: 0,
      totalSchoolAgeChildren: 0,
    },
    distanceToSchool: data.educationYouth?.distanceToSchool || 0,
    literacyLevel: data.educationYouth?.literacyLevel || {
      adultLiteracy: false,
      details: '',
    },
    vocationalTraining: data.educationYouth?.vocationalTraining || [],
  });

  const [newVocationalSkill, setNewVocationalSkill] = useState('');

  useEffect(() => {
    onUpdate({ educationYouth });
  }, [educationYouth, onUpdate]);

  const updateField = (field: keyof EducationYouth, value: any) => {
    setEducationYouth(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: keyof EducationYouth, field: string, value: any) => {
    setEducationYouth(prev => ({
      ...prev,
      [parent]: { ...(prev[parent] as any), [field]: value }
    }));
  };

  const addVocationalSkill = () => {
    if (newVocationalSkill.trim()) {
      setEducationYouth(prev => ({
        ...prev,
        vocationalTraining: [...prev.vocationalTraining, newVocationalSkill.trim()]
      }));
      setNewVocationalSkill('');
    }
  };

  const removeVocationalSkill = (index: number) => {
    setEducationYouth(prev => ({
      ...prev,
      vocationalTraining: prev.vocationalTraining.filter((_, i) => i !== index)
    }));
  };

  const attendanceRate = educationYouth.schoolAttendance.totalSchoolAgeChildren > 0
    ? Math.round((educationYouth.schoolAttendance.childrenInSchool / educationYouth.schoolAttendance.totalSchoolAgeChildren) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>School Attendance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Total School-Age Children (5-18 years)
              </label>
              <Input
                type="number"
                min="0"
                value={educationYouth.schoolAttendance.totalSchoolAgeChildren}
                onChange={(e) => updateNestedField('schoolAttendance', 'totalSchoolAgeChildren', parseInt(e.target.value) || 0)}
                placeholder="Total children aged 5-18"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Children Currently in School
              </label>
              <Input
                type="number"
                min="0"
                max={educationYouth.schoolAttendance.totalSchoolAgeChildren}
                value={educationYouth.schoolAttendance.childrenInSchool}
                onChange={(e) => updateNestedField('schoolAttendance', 'childrenInSchool', parseInt(e.target.value) || 0)}
                placeholder="Children attending school"
              />
            </div>
          </div>

          {educationYouth.schoolAttendance.totalSchoolAgeChildren > 0 && (
            <div className={`p-4 rounded-lg ${attendanceRate >= 80 ? 'bg-green-50' : attendanceRate >= 50 ? 'bg-yellow-50' : 'bg-red-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-medium ${attendanceRate >= 80 ? 'text-green-900' : attendanceRate >= 50 ? 'text-yellow-900' : 'text-red-900'}`}>
                    School Attendance Rate
                  </h4>
                  <p className={`text-sm ${attendanceRate >= 80 ? 'text-green-700' : attendanceRate >= 50 ? 'text-yellow-700' : 'text-red-700'}`}>
                    {educationYouth.schoolAttendance.childrenInSchool} out of {educationYouth.schoolAttendance.totalSchoolAgeChildren} children
                  </p>
                </div>
                <div className={`text-3xl font-bold ${attendanceRate >= 80 ? 'text-green-600' : attendanceRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {attendanceRate}%
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Distance to Nearest School (km)
            </label>
            <Input
              type="number"
              min="0"
              step="0.1"
              value={educationYouth.distanceToSchool}
              onChange={(e) => updateField('distanceToSchool', parseFloat(e.target.value) || 0)}
              placeholder="Distance in kilometers"
            />
          </div>

          {educationYouth.schoolAttendance.childrenInSchool < educationYouth.schoolAttendance.totalSchoolAgeChildren && (
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Reasons for Non-Attendance</h4>
              <Textarea
                placeholder="Why are some children not attending school? (e.g., distance, cost, work obligations, lack of facilities)"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Adult Literacy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="adult-literacy"
              checked={educationYouth.literacyLevel.adultLiteracy}
              onCheckedChange={(checked) => updateNestedField('literacyLevel', 'adultLiteracy', !!checked)}
            />
            <label htmlFor="adult-literacy" className="text-sm font-medium">
              Adults in household can read and write
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Literacy Details
            </label>
            <Textarea
              value={educationYouth.literacyLevel.details}
              onChange={(e) => updateNestedField('literacyLevel', 'details', e.target.value)}
              placeholder="Describe literacy levels of adults, languages they can read/write, any literacy challenges..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Languages Read/Written</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox id="english" />
                  <label htmlFor="english">English</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="tok-pisin" />
                  <label htmlFor="tok-pisin">Tok Pisin</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="local-language" />
                  <label htmlFor="local-language">Local Language</label>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Literacy Support Needed</h4>
              <Textarea
                placeholder="What literacy support would help the household?"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Vocational & Technical Training</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Vocational Skills and Training in Household
            </label>

            <div className="space-y-2">
              {educationYouth.vocationalTraining.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{skill}</span>
                  <Button
                    onClick={() => removeVocationalSkill(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {educationYouth.vocationalTraining.length === 0 && (
                <p className="text-sm text-gray-500 italic py-2">No vocational skills listed</p>
              )}
            </div>

            <div className="flex space-x-2 mt-3">
              <Input
                value={newVocationalSkill}
                onChange={(e) => setNewVocationalSkill(e.target.value)}
                placeholder="e.g., Carpentry, Mechanics, Sewing, Electronics, Cooking"
                onKeyPress={(e) => e.key === 'Enter' && addVocationalSkill()}
              />
              <Button
                onClick={addVocationalSkill}
                disabled={!newVocationalSkill.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Training Received Where/When
              </label>
              <Textarea
                placeholder="Where and when was vocational training received? (schools, programs, informal learning)"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Training Needs for Youth
              </label>
              <Textarea
                placeholder="What vocational training would benefit young people in the household?"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Educational Priorities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Educational Aspirations for Children
            </label>
            <Textarea
              placeholder="What level of education do you hope your children will achieve? What subjects or careers interest them?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Educational Challenges
            </label>
            <Textarea
              placeholder="What are the main challenges preventing children from attending school or achieving their educational goals?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Educational Support Needed
            </label>
            <Textarea
              placeholder="What educational support or resources would help improve educational outcomes for your household?"
              rows={3}
            />
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Educational Priorities in Resettlement</h4>
            <Textarea
              placeholder="What educational facilities and programs would be most important in the new settlement?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Education & Youth Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>School Attendance Rate:</strong> {attendanceRate}%</p>
                <p><strong>Children in School:</strong> {educationYouth.schoolAttendance.childrenInSchool}/{educationYouth.schoolAttendance.totalSchoolAgeChildren}</p>
                <p><strong>Distance to School:</strong> {educationYouth.distanceToSchool} km</p>
              </div>
              <div>
                <p><strong>Adult Literacy:</strong> {educationYouth.literacyLevel.adultLiteracy ? 'Yes' : 'No'}</p>
                <p><strong>Vocational Skills:</strong> {educationYouth.vocationalTraining.length} listed</p>
                <p><strong>Key Skills:</strong> {educationYouth.vocationalTraining.slice(0, 2).join(', ')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
