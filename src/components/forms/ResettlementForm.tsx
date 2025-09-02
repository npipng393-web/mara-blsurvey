'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Users, Tractor, MapPin, Plus, Trash2 } from 'lucide-react';
import { SurveyFormData, ResettlementNeeds } from '@/lib/types';

interface ResettlementFormProps {
  data: SurveyFormData;
  onUpdate: (data: Partial<SurveyFormData>) => void;
}

export function ResettlementForm({ data, onUpdate }: ResettlementFormProps) {
  const [resettlementNeeds, setResettlementNeeds] = useState<ResettlementNeeds>({
    willingnessToRelocate: data.resettlementNeeds?.willingnessToRelocate ?? true,
    preferredLandSize: data.resettlementNeeds?.preferredLandSize || {
      perHousehold: 0,
      perClan: 0,
    },
    housingNeeds: data.resettlementNeeds?.housingNeeds || {
      numberOfRooms: 2,
      houseType: '',
    },
    agriculturalLandRequirement: data.resettlementNeeds?.agriculturalLandRequirement || {
      subsistenceFarming: 0,
      cashCrop: 0,
      livestock: 0,
    },
    communalFacilitiesNeeded: data.resettlementNeeds?.communalFacilitiesNeeded || [],
    skillsToContribute: data.resettlementNeeds?.skillsToContribute || [],
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    onUpdate({ resettlementNeeds });
  }, [resettlementNeeds, onUpdate]);

  const updateField = (field: keyof ResettlementNeeds, value: any) => {
    setResettlementNeeds(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: keyof ResettlementNeeds, field: string, value: any) => {
    setResettlementNeeds(prev => ({
      ...prev,
      [parent]: { ...(prev[parent] as any), [field]: value }
    }));
  };

  const toggleCommunalFacility = (facility: string, checked: boolean) => {
    setResettlementNeeds(prev => ({
      ...prev,
      communalFacilitiesNeeded: checked
        ? [...prev.communalFacilitiesNeeded, facility]
        : prev.communalFacilitiesNeeded.filter(f => f !== facility)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResettlementNeeds(prev => ({
        ...prev,
        skillsToContribute: [...prev.skillsToContribute, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setResettlementNeeds(prev => ({
      ...prev,
      skillsToContribute: prev.skillsToContribute.filter((_, i) => i !== index)
    }));
  };

  const communalFacilities = [
    'Clean Water Source',
    'Market/Trading Post',
    'Church/Religious Facility',
    'Primary School',
    'Secondary School',
    'Health Clinic',
    'Community Center',
    'Sports Facilities',
    'Cemetery',
    'Road Access',
    'Electricity',
    'Telecommunications',
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Willingness to Relocate</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">
              Are you willing to relocate to Andarum as part of the resettlement program?
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="willing-yes"
                  name="willingness"
                  checked={resettlementNeeds.willingnessToRelocate === true}
                  onChange={() => updateField('willingnessToRelocate', true)}
                  className="h-4 w-4"
                />
                <label htmlFor="willing-yes" className="text-sm">Yes, we are willing to relocate</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="willing-no"
                  name="willingness"
                  checked={resettlementNeeds.willingnessToRelocate === false}
                  onChange={() => updateField('willingnessToRelocate', false)}
                  className="h-4 w-4"
                />
                <label htmlFor="willing-no" className="text-sm">No, we prefer to stay in current location</label>
              </div>
            </div>
          </div>

          {resettlementNeeds.willingnessToRelocate === false && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Reason for not wanting to relocate:</h4>
              <Textarea
                placeholder="Please explain why you prefer to stay in your current location..."
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {resettlementNeeds.willingnessToRelocate && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Land Size Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preferred Land Size per Household (acres)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={resettlementNeeds.preferredLandSize.perHousehold}
                    onChange={(e) => updateNestedField('preferredLandSize', 'perHousehold', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preferred Land Size per Clan (acres)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={resettlementNeeds.preferredLandSize.perClan}
                    onChange={(e) => updateNestedField('preferredLandSize', 'perClan', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Housing Needs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Rooms Needed
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={resettlementNeeds.housingNeeds.numberOfRooms}
                    onChange={(e) => updateNestedField('housingNeeds', 'numberOfRooms', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preferred House Type
                  </label>
                  <Select
                    value={resettlementNeeds.housingNeeds.houseType}
                    onValueChange={(value) => updateNestedField('housingNeeds', 'houseType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select house type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">Traditional materials (bush materials)</SelectItem>
                      <SelectItem value="semi-permanent">Semi-permanent (mixed materials)</SelectItem>
                      <SelectItem value="permanent">Permanent (concrete/brick)</SelectItem>
                      <SelectItem value="government-standard">Government standard housing</SelectItem>
                      <SelectItem value="custom">Custom design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tractor className="h-5 w-5" />
                <span>Agricultural Land Requirements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subsistence Farming (acres)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={resettlementNeeds.agriculturalLandRequirement.subsistenceFarming}
                    onChange={(e) => updateNestedField('agriculturalLandRequirement', 'subsistenceFarming', parseFloat(e.target.value) || 0)}
                    placeholder="Food crops"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cash Crop Farming (acres)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={resettlementNeeds.agriculturalLandRequirement.cashCrop}
                    onChange={(e) => updateNestedField('agriculturalLandRequirement', 'cashCrop', parseFloat(e.target.value) || 0)}
                    placeholder="Commercial crops"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Livestock Area (acres)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={resettlementNeeds.agriculturalLandRequirement.livestock}
                    onChange={(e) => updateNestedField('agriculturalLandRequirement', 'livestock', parseFloat(e.target.value) || 0)}
                    placeholder="Animals"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Communal Facilities Needed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {communalFacilities.map((facility) => (
                  <div key={facility} className="flex items-center space-x-2">
                    <Checkbox
                      id={facility}
                      checked={resettlementNeeds.communalFacilitiesNeeded.includes(facility)}
                      onCheckedChange={(checked) => toggleCommunalFacility(facility, !!checked)}
                    />
                    <label htmlFor={facility} className="text-sm">{facility}</label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills to Contribute</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What skills can your household contribute to the new settlement?
                </label>

                <div className="space-y-2">
                  {resettlementNeeds.skillsToContribute.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{skill}</span>
                      <Button
                        onClick={() => removeSkill(index)}
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
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g., Carpentry, Teaching, Fishing, etc."
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button
                    onClick={addSkill}
                    disabled={!newSkill.trim()}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className={`p-4 rounded-lg ${resettlementNeeds.willingnessToRelocate ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <h4 className={`font-medium mb-2 ${resettlementNeeds.willingnessToRelocate ? 'text-green-900' : 'text-yellow-900'}`}>
              Resettlement Summary
            </h4>
            <div className="text-sm space-y-1">
              <p><strong>Willing to Relocate:</strong> {resettlementNeeds.willingnessToRelocate ? 'Yes' : 'No'}</p>
              {resettlementNeeds.willingnessToRelocate && (
                <>
                  <p><strong>Land per Household:</strong> {resettlementNeeds.preferredLandSize.perHousehold} acres</p>
                  <p><strong>House Type:</strong> {resettlementNeeds.housingNeeds.houseType || 'Not specified'}</p>
                  <p><strong>Rooms Needed:</strong> {resettlementNeeds.housingNeeds.numberOfRooms}</p>
                  <p><strong>Skills to Contribute:</strong> {resettlementNeeds.skillsToContribute.length} listed</p>
                  <p><strong>Facilities Needed:</strong> {resettlementNeeds.communalFacilitiesNeeded.length} selected</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
