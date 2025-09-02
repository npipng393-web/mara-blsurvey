'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SurveyFormData, HouseholdStructure } from '@/lib/types';

interface HouseholdFormProps {
  data: SurveyFormData;
  onUpdate: (data: Partial<SurveyFormData>) => void;
}

export function HouseholdForm({ data, onUpdate }: HouseholdFormProps) {
  const [householdStructure, setHouseholdStructure] = useState<HouseholdStructure>({
    householdHead: data.householdStructure?.householdHead || '',
    householdSize: data.householdStructure?.householdSize || 0,
    familyClanAffiliation: data.householdStructure?.familyClanAffiliation || '',
    chiefLeaderLink: data.householdStructure?.chiefLeaderLink || '',
    dependents: data.householdStructure?.dependents || {
      childrenUnder18: 0,
      elderlyAbove60: 0,
      widows: 0,
      orphans: 0,
    },
  });

  useEffect(() => {
    onUpdate({ householdStructure });
  }, [householdStructure, onUpdate]);

  const updateField = (field: keyof HouseholdStructure, value: any) => {
    setHouseholdStructure(prev => ({ ...prev, [field]: value }));
  };

  const updateDependents = (field: keyof HouseholdStructure['dependents'], value: number) => {
    setHouseholdStructure(prev => ({
      ...prev,
      dependents: { ...prev.dependents, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Household Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name of Household Head</label>
              <Input
                value={householdStructure.householdHead}
                onChange={(e) => updateField('householdHead', e.target.value)}
                placeholder="Enter household head name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Household Size</label>
              <Input
                type="number"
                value={householdStructure.householdSize}
                onChange={(e) => updateField('householdSize', parseInt(e.target.value) || 0)}
                placeholder="Total number of people"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Family/Clan Affiliation</label>
              <Input
                value={householdStructure.familyClanAffiliation}
                onChange={(e) => updateField('familyClanAffiliation', e.target.value)}
                placeholder="Enter clan or family group name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Chief/Leader Representation</label>
              <Input
                value={householdStructure.chiefLeaderLink}
                onChange={(e) => updateField('chiefLeaderLink', e.target.value)}
                placeholder="Name of traditional chief or leader"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dependents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Children Under 18</label>
              <Input
                type="number"
                value={householdStructure.dependents.childrenUnder18}
                onChange={(e) => updateDependents('childrenUnder18', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Elderly Above 60</label>
              <Input
                type="number"
                value={householdStructure.dependents.elderlyAbove60}
                onChange={(e) => updateDependents('elderlyAbove60', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Widows</label>
              <Input
                type="number"
                value={householdStructure.dependents.widows}
                onChange={(e) => updateDependents('widows', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Orphans</label>
              <Input
                type="number"
                value={householdStructure.dependents.orphans}
                onChange={(e) => updateDependents('orphans', parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
