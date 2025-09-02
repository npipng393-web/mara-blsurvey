'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, TreePine, Fish, Scale, AlertTriangle } from 'lucide-react';
import { SurveyFormData, LandResourceOwnership } from '@/lib/types';

interface LandFormProps {
  data: SurveyFormData;
  onUpdate: (data: Partial<SurveyFormData>) => void;
}

export function LandForm({ data, onUpdate }: LandFormProps) {
  const [landResourceOwnership, setLandResourceOwnership] = useState<LandResourceOwnership>({
    landOwnershipStatus: data.landResourceOwnership?.landOwnershipStatus || 'Government land',
    landDisputes: data.landResourceOwnership?.landDisputes || '',
    accessToResources: data.landResourceOwnership?.accessToResources || {
      fishingGrounds: false,
      gardens: false,
      forests: false,
    },
    communalResourceRights: data.landResourceOwnership?.communalResourceRights || '',
  });

  useEffect(() => {
    onUpdate({ landResourceOwnership });
  }, [landResourceOwnership, onUpdate]);

  const updateField = (field: keyof LandResourceOwnership, value: any) => {
    setLandResourceOwnership(prev => ({ ...prev, [field]: value }));
  };

  const updateAccessField = (field: keyof LandResourceOwnership['accessToResources'], value: boolean) => {
    setLandResourceOwnership(prev => ({
      ...prev,
      accessToResources: { ...prev.accessToResources, [field]: value }
    }));
  };

  const getOwnershipStatusColor = (status: string) => {
    switch (status) {
      case 'Own land': return 'bg-green-50 text-green-800 border-green-200';
      case 'Government land': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Private land': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Disputed': return 'bg-red-50 text-red-800 border-red-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Land Ownership Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Land Ownership Status
            </label>
            <Select
              value={landResourceOwnership.landOwnershipStatus}
              onValueChange={(value: any) => updateField('landOwnershipStatus', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Own land">Own land (customary/traditional ownership)</SelectItem>
                <SelectItem value="Government land">Government land (using with permission)</SelectItem>
                <SelectItem value="Private land">Private land (renting/using)</SelectItem>
                <SelectItem value="Disputed">Disputed ownership</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`p-4 rounded-lg border ${getOwnershipStatusColor(landResourceOwnership.landOwnershipStatus)}`}>
            <h4 className="font-medium mb-2">Land Status: {landResourceOwnership.landOwnershipStatus}</h4>

            {landResourceOwnership.landOwnershipStatus === 'Own land' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Land Size (if known)</label>
                  <Input placeholder="Approximate size in acres or hectares" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Traditional/Customary Rights</label>
                  <Textarea
                    placeholder="Describe the traditional or customary ownership rights, inheritance patterns, clan connections..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {landResourceOwnership.landOwnershipStatus === 'Government land' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Permission/Agreement Details</label>
                  <Textarea
                    placeholder="Describe any formal or informal agreements for land use, duration, restrictions..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {landResourceOwnership.landOwnershipStatus === 'Private land' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Rental/Use Agreement</label>
                  <Textarea
                    placeholder="Describe rental agreement, payments, duration, owner details..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {landResourceOwnership.landOwnershipStatus === 'Disputed' && (
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Dispute Details</label>
                    <Textarea
                      placeholder="Describe the nature of the land dispute, parties involved, status of resolution..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="h-5 w-5" />
            <span>Land Disputes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Current or Past Land Disputes
            </label>
            <Textarea
              value={landResourceOwnership.landDisputes}
              onChange={(e) => updateField('landDisputes', e.target.value)}
              placeholder="Describe any land disputes with host communities, between clans, or with authorities. Include resolution status if applicable."
              rows={4}
            />
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Dispute Prevention</h4>
            <Textarea
              placeholder="What measures could help prevent or resolve land disputes in the resettlement area?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TreePine className="h-5 w-5" />
            <span>Access to Natural Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">
              Which natural resources does your household currently have access to?
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fishing-grounds"
                  checked={landResourceOwnership.accessToResources.fishingGrounds}
                  onCheckedChange={(checked) => updateAccessField('fishingGrounds', !!checked)}
                />
                <label htmlFor="fishing-grounds" className="text-sm flex items-center space-x-2">
                  <Fish className="h-4 w-4" />
                  <span>Fishing grounds (rivers, sea, lagoons)</span>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gardens"
                  checked={landResourceOwnership.accessToResources.gardens}
                  onCheckedChange={(checked) => updateAccessField('gardens', !!checked)}
                />
                <label htmlFor="gardens" className="text-sm flex items-center space-x-2">
                  <span>🌱</span>
                  <span>Garden/agricultural land</span>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="forests"
                  checked={landResourceOwnership.accessToResources.forests}
                  onCheckedChange={(checked) => updateAccessField('forests', !!checked)}
                />
                <label htmlFor="forests" className="text-sm flex items-center space-x-2">
                  <TreePine className="h-4 w-4" />
                  <span>Forest resources (timber, hunting, gathering)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {landResourceOwnership.accessToResources.fishingGrounds && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Fishing Access Details</h4>
                <Textarea
                  placeholder="Describe fishing areas accessible, types of fish, seasonal patterns, any restrictions..."
                  rows={3}
                />
              </div>
            )}

            {landResourceOwnership.accessToResources.gardens && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Garden/Agricultural Details</h4>
                <Textarea
                  placeholder="Describe garden areas, crops grown, soil quality, irrigation access..."
                  rows={3}
                />
              </div>
            )}

            {landResourceOwnership.accessToResources.forests && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Forest Resource Details</h4>
                <Textarea
                  placeholder="Describe forest areas accessible, materials gathered, hunting opportunities, any restrictions..."
                  rows={3}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Resource Access Challenges
            </label>
            <Textarea
              placeholder="What challenges do you face in accessing natural resources? (distance, permissions, competition, degradation)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communal Resource Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Community Resource Management
            </label>
            <Textarea
              value={landResourceOwnership.communalResourceRights}
              onChange={(e) => updateField('communalResourceRights', e.target.value)}
              placeholder="Who controls access to communal resources? What are the rules and decision-making processes? How are conflicts resolved?"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Traditional Resource Management
              </label>
              <Textarea
                placeholder="Describe traditional customs, taboos, or practices for managing natural resources..."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Resource Rights in Resettlement
              </label>
              <Textarea
                placeholder="What resource access rights would be important in the new settlement area?"
                rows={3}
              />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Sustainable Resource Use</h4>
            <Textarea
              placeholder="How does your community ensure sustainable use of natural resources? What practices could be continued in resettlement?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resource Security & Future Needs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Resource Security Concerns
            </label>
            <Textarea
              placeholder="What are your main concerns about secure access to land and natural resources?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Priority Resources for Resettlement
            </label>
            <Textarea
              placeholder="What land and resource access would be most important for your household in the new settlement?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Land & Resource Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Land Status:</strong> {landResourceOwnership.landOwnershipStatus}</p>
                <p><strong>Disputes:</strong> {landResourceOwnership.landDisputes ? 'Yes' : 'None reported'}</p>
              </div>
              <div>
                <p><strong>Fishing Access:</strong> {landResourceOwnership.accessToResources.fishingGrounds ? 'Yes' : 'No'}</p>
                <p><strong>Garden Access:</strong> {landResourceOwnership.accessToResources.gardens ? 'Yes' : 'No'}</p>
                <p><strong>Forest Access:</strong> {landResourceOwnership.accessToResources.forests ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
