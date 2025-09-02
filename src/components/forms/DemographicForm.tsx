'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { SurveyFormData, HouseholdMember, DemographicInformation } from '@/lib/types';

interface DemographicFormProps {
  data: SurveyFormData;
  onUpdate: (data: Partial<SurveyFormData>) => void;
}

export function DemographicForm({ data, onUpdate }: DemographicFormProps) {
  const [demographicInfo, setDemographicInfo] = useState<DemographicInformation>({
    householdId: data.demographicInfo?.householdId || '',
    familyId: data.demographicInfo?.familyId || '',
    members: data.demographicInfo?.members || [createEmptyMember()],
  });

  function createEmptyMember(): HouseholdMember {
    return {
      id: Math.random().toString(36).substr(2, 9),
      fullName: '',
      sex: 'Male',
      dateOfBirth: '',
      age: 0,
      maritalStatus: 'Single',
      relationshipToHead: '',
      educationLevel: 'None',
      occupation: '',
      skills: [],
      disabilityStatus: '',
    };
  }

  useEffect(() => {
    onUpdate({ demographicInfo });
  }, [demographicInfo, onUpdate]);

  const updateMember = (index: number, updates: Partial<HouseholdMember>) => {
    const updatedMembers = [...demographicInfo.members];
    updatedMembers[index] = { ...updatedMembers[index], ...updates };
    setDemographicInfo(prev => ({ ...prev, members: updatedMembers }));
  };

  const addMember = () => {
    setDemographicInfo(prev => ({
      ...prev,
      members: [...prev.members, createEmptyMember()],
    }));
  };

  const removeMember = (index: number) => {
    if (demographicInfo.members.length > 1) {
      const updatedMembers = demographicInfo.members.filter((_, i) => i !== index);
      setDemographicInfo(prev => ({ ...prev, members: updatedMembers }));
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Household ID</label>
          <Input
            value={demographicInfo.householdId}
            onChange={(e) => setDemographicInfo(prev => ({ ...prev, householdId: e.target.value }))}
            placeholder="Enter unique household ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Family ID</label>
          <Input
            value={demographicInfo.familyId}
            onChange={(e) => setDemographicInfo(prev => ({ ...prev, familyId: e.target.value }))}
            placeholder="Enter family ID"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Household Members</h3>
          <Button onClick={addMember} size="sm" className="flex items-center space-x-1">
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </Button>
        </div>

        <div className="space-y-4">
          {demographicInfo.members.map((member, index) => (
            <Card key={member.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    Member {index + 1} {member.fullName && `- ${member.fullName}`}
                  </CardTitle>
                  {demographicInfo.members.length > 1 && (
                    <Button
                      onClick={() => removeMember(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      value={member.fullName}
                      onChange={(e) => updateMember(index, { fullName: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sex</label>
                    <Select
                      value={member.sex}
                      onValueChange={(value) =>
                        updateMember(index, { sex: value as 'Male' | 'Female' | 'Other' })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date of Birth</label>
                    <Input
                      type="date"
                      value={member.dateOfBirth}
                      onChange={(e) => {
                        const age = calculateAge(e.target.value);
                        updateMember(index, {
                          dateOfBirth: e.target.value,
                          age
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <Input
                      type="number"
                      value={member.age}
                      onChange={(e) => updateMember(index, { age: parseInt(e.target.value) || 0 })}
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Marital Status</label>
                    <Select
                      value={member.maritalStatus}
                      onValueChange={(value: any) => updateMember(index, { maritalStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                        <SelectItem value="Separated">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Relationship to Household Head</label>
                    <Input
                      value={member.relationshipToHead}
                      onChange={(e) => updateMember(index, { relationshipToHead: e.target.value })}
                      placeholder="e.g., Head, Spouse, Child, Parent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Education Level</label>
                    <Select
                      value={member.educationLevel}
                      onValueChange={(value: any) => updateMember(index, { educationLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Secondary">Secondary</SelectItem>
                        <SelectItem value="Tertiary">Tertiary</SelectItem>
                        <SelectItem value="Vocational">Vocational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Occupation</label>
                    <Input
                      value={member.occupation}
                      onChange={(e) => updateMember(index, { occupation: e.target.value })}
                      placeholder="Current occupation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Skills</label>
                    <Textarea
                      value={member.skills.join(', ')}
                      onChange={(e) => updateMember(index, {
                        skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      })}
                      placeholder="List skills separated by commas"
                      rows={2}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Disability Status</label>
                  <Input
                    value={member.disabilityStatus}
                    onChange={(e) => updateMember(index, { disabilityStatus: e.target.value })}
                    placeholder="Describe any disabilities or leave blank"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
