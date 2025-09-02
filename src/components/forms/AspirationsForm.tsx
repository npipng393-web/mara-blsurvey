'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, GraduationCap, Briefcase, Home, Plus, Trash2, Target } from 'lucide-react';
import { SurveyFormData, FutureAspirations } from '@/lib/types';

interface AspirationsFormProps {
  data: SurveyFormData;
  onUpdate: (data: Partial<SurveyFormData>) => void;
}

export function AspirationsForm({ data, onUpdate }: AspirationsFormProps) {
  const [futureAspirations, setFutureAspirations] = useState<FutureAspirations>({
    educationAspirations: data.futureAspirations?.educationAspirations || [],
    skillsTrainingNeeds: data.futureAspirations?.skillsTrainingNeeds || [],
    preferredLivelihood: data.futureAspirations?.preferredLivelihood || [],
    expectationsFromGovernment: data.futureAspirations?.expectationsFromGovernment || [],
  });

  const [newEducationAspiration, setNewEducationAspiration] = useState('');
  const [newSkillsTraining, setNewSkillsTraining] = useState('');
  const [newLivelihood, setNewLivelihood] = useState('');
  const [newExpectation, setNewExpectation] = useState('');

  useEffect(() => {
    onUpdate({ futureAspirations });
  }, [futureAspirations, onUpdate]);

  const addItem = (field: keyof FutureAspirations, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFutureAspirations(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const removeItem = (field: keyof FutureAspirations, index: number) => {
    setFutureAspirations(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Survey Completion Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900 flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Final Survey Section</span>
                </h3>
                <p className="text-green-700 text-sm">
                  You're completing the last section of the 13-part baseline survey!
                </p>
              </div>
              <div className="text-green-600">
                <Target className="h-8 w-8" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>Educational Aspirations for Children</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Educational Goals for Children
            </label>

            <div className="space-y-2">
              {futureAspirations.educationAspirations.map((aspiration, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <span className="text-sm">{aspiration}</span>
                  <Button
                    onClick={() => removeItem('educationAspirations', index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {futureAspirations.educationAspirations.length === 0 && (
                <p className="text-sm text-gray-500 italic py-2">No educational aspirations listed yet</p>
              )}
            </div>

            <div className="flex space-x-2 mt-3">
              <Input
                value={newEducationAspiration}
                onChange={(e) => setNewEducationAspiration(e.target.value)}
                placeholder="e.g., All children complete secondary school, University education for eldest child, Technical college for practical skills"
                onKeyPress={(e) => e.key === 'Enter' && addItem('educationAspirations', newEducationAspiration, setNewEducationAspiration)}
              />
              <Button
                onClick={() => addItem('educationAspirations', newEducationAspiration, setNewEducationAspiration)}
                disabled={!newEducationAspiration.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Career Aspirations for Children
              </label>
              <Textarea
                placeholder="What careers or professions do you hope your children will pursue? What opportunities do you want them to have?"
                rows={3}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Educational Support Needed
              </label>
              <Textarea
                placeholder="What educational support, resources, or opportunities would help achieve these aspirations?"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5" />
            <span>Skills Training Needs</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Skills Training Priorities
            </label>

            <div className="space-y-2">
              {futureAspirations.skillsTrainingNeeds.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded">
                  <span className="text-sm">{skill}</span>
                  <Button
                    onClick={() => removeItem('skillsTrainingNeeds', index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {futureAspirations.skillsTrainingNeeds.length === 0 && (
                <p className="text-sm text-gray-500 italic py-2">No skills training needs listed yet</p>
              )}
            </div>

            <div className="flex space-x-2 mt-3">
              <Input
                value={newSkillsTraining}
                onChange={(e) => setNewSkillsTraining(e.target.value)}
                placeholder="e.g., Computer skills, Modern farming techniques, Business management, Solar panel installation"
                onKeyPress={(e) => e.key === 'Enter' && addItem('skillsTrainingNeeds', newSkillsTraining, setNewSkillsTraining)}
              />
              <Button
                onClick={() => addItem('skillsTrainingNeeds', newSkillsTraining, setNewSkillsTraining)}
                disabled={!newSkillsTraining.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Training Preferences for Adults
                </label>
                <Textarea
                  placeholder="What skills training would help adults in the household improve their livelihood opportunities?"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Training Preferences for Youth
                </label>
                <Textarea
                  placeholder="What skills training would help young people prepare for their future careers?"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="h-5 w-5" />
            <span>Preferred Livelihood Opportunities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Livelihood Aspirations
            </label>

            <div className="space-y-2">
              {futureAspirations.preferredLivelihood.map((livelihood, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <span className="text-sm">{livelihood}</span>
                  <Button
                    onClick={() => removeItem('preferredLivelihood', index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {futureAspirations.preferredLivelihood.length === 0 && (
                <p className="text-sm text-gray-500 italic py-2">No livelihood preferences listed yet</p>
              )}
            </div>

            <div className="flex space-x-2 mt-3">
              <Input
                value={newLivelihood}
                onChange={(e) => setNewLivelihood(e.target.value)}
                placeholder="e.g., Commercial fishing, Tourism business, Agricultural cooperative, Small-scale manufacturing"
                onKeyPress={(e) => e.key === 'Enter' && addItem('preferredLivelihood', newLivelihood, setNewLivelihood)}
              />
              <Button
                onClick={() => addItem('preferredLivelihood', newLivelihood, setNewLivelihood)}
                disabled={!newLivelihood.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Economic Goals for the Household
              </label>
              <Textarea
                placeholder="What are your economic goals? How do you want to improve your household's financial situation?"
                rows={3}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Business or Enterprise Ideas
              </label>
              <Textarea
                placeholder="Do you have any ideas for businesses or enterprises you'd like to start in the new settlement?"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expectations from Government & Aid Agencies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Expectations and Requests
            </label>

            <div className="space-y-2">
              {futureAspirations.expectationsFromGovernment.map((expectation, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded">
                  <span className="text-sm">{expectation}</span>
                  <Button
                    onClick={() => removeItem('expectationsFromGovernment', index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {futureAspirations.expectationsFromGovernment.length === 0 && (
                <p className="text-sm text-gray-500 italic py-2">No expectations listed yet</p>
              )}
            </div>

            <div className="flex space-x-2 mt-3">
              <Input
                value={newExpectation}
                onChange={(e) => setNewExpectation(e.target.value)}
                placeholder="e.g., Quality schools and healthcare, Road access, Electricity, Clean water, Job creation programs"
                onKeyPress={(e) => e.key === 'Enter' && addItem('expectationsFromGovernment', newExpectation, setNewExpectation)}
              />
              <Button
                onClick={() => addItem('expectationsFromGovernment', newExpectation, setNewExpectation)}
                disabled={!newExpectation.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Priority Services Needed
                </label>
                <Textarea
                  placeholder="What services are most urgently needed in the new settlement? (education, health, infrastructure, etc.)"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Long-term Development Goals
                </label>
                <Textarea
                  placeholder="What long-term development do you hope to see in the new settlement over the next 10 years?"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vision for the Future</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              5-Year Vision for Your Household
            </label>
            <Textarea
              placeholder="Where do you see your household in 5 years? What would success look like for your family?"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              10-Year Vision for the Community
            </label>
            <Textarea
              placeholder="What do you hope the new settlement community will look like in 10 years? What kind of community do you want to build?"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Legacy for Future Generations
            </label>
            <Textarea
              placeholder="What do you want to leave for your children and grandchildren? What kind of future do you want to create for them?"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Message to Government Leaders
            </label>
            <Textarea
              placeholder="If you could speak directly to government leaders about the resettlement, what would you want them to know?"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Future Aspirations Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Education Goals:</strong> {futureAspirations.educationAspirations.length} listed</p>
                <p><strong>Skills Training:</strong> {futureAspirations.skillsTrainingNeeds.length} priorities</p>
              </div>
              <div>
                <p><strong>Livelihood Ideas:</strong> {futureAspirations.preferredLivelihood.length} listed</p>
                <p><strong>Government Expectations:</strong> {futureAspirations.expectationsFromGovernment.length} items</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Survey Completion Message */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 text-center">
            <div className="flex justify-center mb-4">
              <Star className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">
              🎉 Survey Complete!
            </h3>
            <p className="text-green-700 mb-4">
              Thank you for completing all 13 sections of the Manam Islanders Resettlement Baseline Survey.
              Your responses will help ensure the resettlement program meets your household's needs and aspirations.
            </p>
            <p className="text-sm text-green-600">
              Don't forget to save your progress and generate a final report with all your responses.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
