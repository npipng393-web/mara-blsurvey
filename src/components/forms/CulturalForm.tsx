'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SurveyFormData, CulturalIdentity } from '@/lib/types';

interface CulturalFormProps {
  data: SurveyFormData;
  onUpdate: (data: Partial<SurveyFormData>) => void;
}

export function CulturalForm({ data, onUpdate }: CulturalFormProps) {
  const [culturalIdentity, setCulturalIdentity] = useState<CulturalIdentity>({
    clanName: data.culturalIdentity?.clanName || '',
    subClanLineage: data.culturalIdentity?.subClanLineage || '',
    traditionalChief: data.culturalIdentity?.traditionalChief || '',
    culturalGroups: data.culturalIdentity?.culturalGroups || [],
    culturalRestrictions: data.culturalIdentity?.culturalRestrictions || '',
  });

  useEffect(() => {
    onUpdate({ culturalIdentity });
  }, [culturalIdentity, onUpdate]);

  const updateField = (field: keyof CulturalIdentity, value: any) => {
    setCulturalIdentity(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Clan and Lineage Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Clan Name</label>
              <Input
                value={culturalIdentity.clanName}
                onChange={(e) => updateField('clanName', e.target.value)}
                placeholder="Enter clan name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sub-clan or Lineage</label>
              <Input
                value={culturalIdentity.subClanLineage}
                onChange={(e) => updateField('subClanLineage', e.target.value)}
                placeholder="Enter sub-clan or lineage (if applicable)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Recognized Traditional Chief/Leader</label>
            <Input
              value={culturalIdentity.traditionalChief}
              onChange={(e) => updateField('traditionalChief', e.target.value)}
              placeholder="Enter name of traditional chief or leader for this household"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cultural Participation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Cultural Groups Participation
            </label>
            <Textarea
              value={culturalIdentity.culturalGroups.join(', ')}
              onChange={(e) => updateField('culturalGroups',
                e.target.value.split(',').map(g => g.trim()).filter(g => g)
              )}
              placeholder="List cultural groups, ceremonial groups, church groups, or community organizations (separated by commas)"
              rows={3}
            />
            <p className="text-sm text-gray-600 mt-1">
              Examples: Church choir, traditional dance group, ceremonial committee, community council
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Cultural Restrictions/Preferences
            </label>
            <Textarea
              value={culturalIdentity.culturalRestrictions}
              onChange={(e) => updateField('culturalRestrictions', e.target.value)}
              placeholder="Describe any cultural restrictions or preferences regarding intermixing with other clans, settlement layouts, or other cultural considerations"
              rows={4}
            />
            <p className="text-sm text-gray-600 mt-1">
              Examples: Restrictions on living arrangements, ceremonial space requirements, proximity to other clans
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
