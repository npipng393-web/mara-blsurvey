'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Users, Shield, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { SurveyFormData, GovernanceSecurity } from '@/lib/types';

interface GovernanceFormProps {
  data: SurveyFormData;
  onUpdate: (data: Partial<SurveyFormData>) => void;
}

export function GovernanceForm({ data, onUpdate }: GovernanceFormProps) {
  const [governanceSecurity, setGovernanceSecurity] = useState<GovernanceSecurity>({
    traditionalLeadership: data.governanceSecurity?.traditionalLeadership || {
      chiefCouncilStructure: '',
      campLeadershipInvolvement: false,
    },
    conflictIssues: data.governanceSecurity?.conflictIssues || [],
    lawOrderConcerns: data.governanceSecurity?.lawOrderConcerns || [],
  });

  const [newConflictIssue, setNewConflictIssue] = useState('');
  const [newLawOrderConcern, setNewLawOrderConcern] = useState('');

  useEffect(() => {
    onUpdate({ governanceSecurity });
  }, [governanceSecurity, onUpdate]);

  const updateNestedField = (parent: keyof GovernanceSecurity, field: string, value: any) => {
    setGovernanceSecurity(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const addConflictIssue = () => {
    if (newConflictIssue.trim()) {
      setGovernanceSecurity(prev => ({
        ...prev,
        conflictIssues: [...prev.conflictIssues, newConflictIssue.trim()]
      }));
      setNewConflictIssue('');
    }
  };

  const removeConflictIssue = (index: number) => {
    setGovernanceSecurity(prev => ({
      ...prev,
      conflictIssues: prev.conflictIssues.filter((_, i) => i !== index)
    }));
  };

  const addLawOrderConcern = () => {
    if (newLawOrderConcern.trim()) {
      setGovernanceSecurity(prev => ({
        ...prev,
        lawOrderConcerns: [...prev.lawOrderConcerns, newLawOrderConcern.trim()]
      }));
      setNewLawOrderConcern('');
    }
  };

  const removeLawOrderConcern = (index: number) => {
    setGovernanceSecurity(prev => ({
      ...prev,
      lawOrderConcerns: prev.lawOrderConcerns.filter((_, i) => i !== index)
    }));
  };

  const commonConflictIssues = [
    'Land disputes between clans',
    'Resource access conflicts',
    'Marriage/family disputes',
    'Boundary disagreements',
    'Leadership succession issues',
    'Cultural/religious differences',
    'Economic disputes',
    'Youth behavioral issues',
  ];

  const commonLawOrderConcerns = [
    'Alcohol-related problems',
    'Domestic violence',
    'Theft/property crime',
    'Youth delinquency',
    'Drug-related issues',
    'Gambling disputes',
    'Assault/physical violence',
    'Lack of police presence',
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5" />
            <span>Traditional Leadership Structure</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Traditional Chief/Council Structure
            </label>
            <Textarea
              value={governanceSecurity.traditionalLeadership.chiefCouncilStructure}
              onChange={(e) => updateNestedField('traditionalLeadership', 'chiefCouncilStructure', e.target.value)}
              placeholder="Describe the traditional leadership structure: who are the recognized chiefs/leaders, how are decisions made, what is their authority?"
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="camp-leadership"
              checked={governanceSecurity.traditionalLeadership.campLeadershipInvolvement}
              onCheckedChange={(checked) => updateNestedField('traditionalLeadership', 'campLeadershipInvolvement', !!checked)}
            />
            <label htmlFor="camp-leadership" className="text-sm font-medium">
              Household member is involved in camp/community leadership
            </label>
          </div>

          {governanceSecurity.traditionalLeadership.campLeadershipInvolvement && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Leadership Role Details</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Leadership Position</label>
                  <Input placeholder="e.g., Committee member, Clan representative, Elder" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Responsibilities</label>
                  <Textarea
                    placeholder="Describe the leadership responsibilities and duties..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Decision-Making Processes
            </label>
            <Textarea
              placeholder="How are important community decisions made? Who participates? How are disagreements resolved?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Leadership Effectiveness
            </label>
            <Textarea
              placeholder="How effective is the current leadership structure? What works well? What could be improved?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Conflict Issues</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">
              Common Conflict Issues in Your Community
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              {commonConflictIssues.map((issue) => (
                <div key={issue} className="flex items-center space-x-2">
                  <Checkbox
                    id={issue}
                    checked={governanceSecurity.conflictIssues.includes(issue)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setGovernanceSecurity(prev => ({
                          ...prev,
                          conflictIssues: [...prev.conflictIssues, issue]
                        }));
                      } else {
                        setGovernanceSecurity(prev => ({
                          ...prev,
                          conflictIssues: prev.conflictIssues.filter(i => i !== issue)
                        }));
                      }
                    }}
                  />
                  <label htmlFor={issue} className="text-sm">{issue}</label>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Conflict Issues</label>
              <div className="space-y-2">
                {governanceSecurity.conflictIssues
                  .filter(issue => !commonConflictIssues.includes(issue))
                  .map((issue, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{issue}</span>
                    <Button
                      onClick={() => removeConflictIssue(governanceSecurity.conflictIssues.indexOf(issue))}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2 mt-3">
                <Input
                  value={newConflictIssue}
                  onChange={(e) => setNewConflictIssue(e.target.value)}
                  placeholder="Describe other conflict issues..."
                  onKeyPress={(e) => e.key === 'Enter' && addConflictIssue()}
                />
                <Button
                  onClick={addConflictIssue}
                  disabled={!newConflictIssue.trim()}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Conflict Resolution Mechanisms
            </label>
            <Textarea
              placeholder="How are conflicts typically resolved in your community? Who mediates? What processes are used?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Conflicts with Host Communities
            </label>
            <Textarea
              placeholder="Are there any conflicts or tensions with host communities? If so, describe the nature and any resolution efforts."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Law & Order Concerns</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">
              Law and Order Issues in Your Community
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              {commonLawOrderConcerns.map((concern) => (
                <div key={concern} className="flex items-center space-x-2">
                  <Checkbox
                    id={concern}
                    checked={governanceSecurity.lawOrderConcerns.includes(concern)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setGovernanceSecurity(prev => ({
                          ...prev,
                          lawOrderConcerns: [...prev.lawOrderConcerns, concern]
                        }));
                      } else {
                        setGovernanceSecurity(prev => ({
                          ...prev,
                          lawOrderConcerns: prev.lawOrderConcerns.filter(c => c !== concern)
                        }));
                      }
                    }}
                  />
                  <label htmlFor={concern} className="text-sm">{concern}</label>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Law & Order Concerns</label>
              <div className="space-y-2">
                {governanceSecurity.lawOrderConcerns
                  .filter(concern => !commonLawOrderConcerns.includes(concern))
                  .map((concern, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{concern}</span>
                    <Button
                      onClick={() => removeLawOrderConcern(governanceSecurity.lawOrderConcerns.indexOf(concern))}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2 mt-3">
                <Input
                  value={newLawOrderConcern}
                  onChange={(e) => setNewLawOrderConcern(e.target.value)}
                  placeholder="Describe other law & order concerns..."
                  onKeyPress={(e) => e.key === 'Enter' && addLawOrderConcern()}
                />
                <Button
                  onClick={addLawOrderConcern}
                  disabled={!newLawOrderConcern.trim()}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Security Measures
              </label>
              <Textarea
                placeholder="What security measures exist in your community? Night watch, community patrols, reporting systems?"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Police/Authority Access
              </label>
              <Textarea
                placeholder="How accessible are police or other authorities? Response times, effectiveness, challenges?"
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
            <span>Community Participation & Governance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Community Meeting Participation
            </label>
            <Textarea
              placeholder="How often are community meetings held? Who participates? How are decisions made collectively?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Women's Participation in Governance
            </label>
            <Textarea
              placeholder="What role do women play in community decision-making? Are there women's groups or committees?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Youth Involvement
            </label>
            <Textarea
              placeholder="How are young people involved in community governance? What roles do they play?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              External Authority Relations
            </label>
            <Textarea
              placeholder="How does your community interact with government officials, NGOs, or other external authorities?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Governance in Resettlement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Governance Preferences for New Settlement
            </label>
            <Textarea
              placeholder="What governance structure would work best in the new settlement? How should leadership be organized?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Security Priorities
            </label>
            <Textarea
              placeholder="What security measures would be most important in the new settlement?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Rule-Making and Enforcement
            </label>
            <Textarea
              placeholder="How should community rules be made and enforced in the new settlement?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Governance & Security Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Leadership Involvement:</strong> {governanceSecurity.traditionalLeadership.campLeadershipInvolvement ? 'Yes' : 'No'}</p>
                <p><strong>Conflict Issues:</strong> {governanceSecurity.conflictIssues.length} identified</p>
              </div>
              <div>
                <p><strong>Law & Order Concerns:</strong> {governanceSecurity.lawOrderConcerns.length} identified</p>
                <p><strong>Key Issues:</strong> {[...governanceSecurity.conflictIssues, ...governanceSecurity.lawOrderConcerns].slice(0, 2).join(', ')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
