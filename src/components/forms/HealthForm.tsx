'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Droplets, Shield, Stethoscope, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SurveyFormData, HealthSocialServices } from '@/lib/types';

interface HealthFormProps {
  data: SurveyFormData;
  onUpdate: (data: Partial<SurveyFormData>) => void;
}

export function HealthForm({ data, onUpdate }: HealthFormProps) {
  const [healthSocialServices, setHealthSocialServices] = useState<HealthSocialServices>({
    accessToHealthServices: data.healthSocialServices?.accessToHealthServices || {
      nearestClinic: '',
      distanceToClinic: 0,
      accessToHospital: false,
      traditionalHealer: false,
    },
    healthStatus: data.healthSocialServices?.healthStatus || {
      chronicIllness: [],
      maternalHealth: '',
      childHealth: '',
    },
    immunizationStatus: data.healthSocialServices?.immunizationStatus || {
      childrenImmunized: false,
      details: '',
    },
    waterAccess: data.healthSocialServices?.waterAccess || {
      hasCleanWater: false,
      sourceType: 'River',
    },
    sanitation: data.healthSocialServices?.sanitation || {
      toiletAvailable: false,
      toiletType: '',
    },
  });

  const [newChronicIllness, setNewChronicIllness] = useState('');

  useEffect(() => {
    onUpdate({ healthSocialServices });
  }, [healthSocialServices, onUpdate]);

  const updateField = (field: keyof HealthSocialServices, value: any) => {
    setHealthSocialServices(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: keyof HealthSocialServices, field: string, value: any) => {
    setHealthSocialServices(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const addChronicIllness = () => {
    if (newChronicIllness.trim()) {
      setHealthSocialServices(prev => ({
        ...prev,
        healthStatus: {
          ...prev.healthStatus,
          chronicIllness: [...prev.healthStatus.chronicIllness, newChronicIllness.trim()]
        }
      }));
      setNewChronicIllness('');
    }
  };

  const removeChronicIllness = (index: number) => {
    setHealthSocialServices(prev => ({
      ...prev,
      healthStatus: {
        ...prev.healthStatus,
        chronicIllness: prev.healthStatus.chronicIllness.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5" />
            <span>Access to Health Services</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nearest Clinic/Health Facility
              </label>
              <Input
                value={healthSocialServices.accessToHealthServices.nearestClinic}
                onChange={(e) => updateNestedField('accessToHealthServices', 'nearestClinic', e.target.value)}
                placeholder="Name of nearest health facility"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Distance to Clinic (km)
              </label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={healthSocialServices.accessToHealthServices.distanceToClinic}
                onChange={(e) => updateNestedField('accessToHealthServices', 'distanceToClinic', parseFloat(e.target.value) || 0)}
                placeholder="Distance in kilometers"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hospital-access"
                checked={healthSocialServices.accessToHealthServices.accessToHospital}
                onCheckedChange={(checked) => updateNestedField('accessToHealthServices', 'accessToHospital', !!checked)}
              />
              <label htmlFor="hospital-access" className="text-sm">Access to hospital services</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="traditional-healer"
                checked={healthSocialServices.accessToHealthServices.traditionalHealer}
                onCheckedChange={(checked) => updateNestedField('accessToHealthServices', 'traditionalHealer', !!checked)}
              />
              <label htmlFor="traditional-healer" className="text-sm">Traditional healer available</label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Health Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Chronic Illnesses in Household
            </label>
            <div className="space-y-2">
              {healthSocialServices.healthStatus.chronicIllness.map((illness, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{illness}</span>
                  <Button
                    onClick={() => removeChronicIllness(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {healthSocialServices.healthStatus.chronicIllness.length === 0 && (
                <p className="text-sm text-gray-500 italic py-2">No chronic illnesses reported</p>
              )}
            </div>

            <div className="flex space-x-2 mt-3">
              <Input
                value={newChronicIllness}
                onChange={(e) => setNewChronicIllness(e.target.value)}
                placeholder="e.g., Diabetes, Hypertension, Asthma"
                onKeyPress={(e) => e.key === 'Enter' && addChronicIllness()}
              />
              <Button
                onClick={addChronicIllness}
                disabled={!newChronicIllness.trim()}
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
                Maternal Health Status
              </label>
              <Textarea
                value={healthSocialServices.healthStatus.maternalHealth}
                onChange={(e) => updateNestedField('healthStatus', 'maternalHealth', e.target.value)}
                placeholder="Current pregnancies, recent births, maternal health concerns..."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Child Health Status
              </label>
              <Textarea
                value={healthSocialServices.healthStatus.childHealth}
                onChange={(e) => updateNestedField('healthStatus', 'childHealth', e.target.value)}
                placeholder="Malnutrition, growth issues, developmental concerns..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Immunization Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="children-immunized"
              checked={healthSocialServices.immunizationStatus.childrenImmunized}
              onCheckedChange={(checked) => updateNestedField('immunizationStatus', 'childrenImmunized', !!checked)}
            />
            <label htmlFor="children-immunized" className="text-sm font-medium">
              Children are up-to-date with immunizations
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Immunization Details
            </label>
            <Textarea
              value={healthSocialServices.immunizationStatus.details}
              onChange={(e) => updateNestedField('immunizationStatus', 'details', e.target.value)}
              placeholder="Specific vaccines received, missing vaccines, immunization records availability..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Droplets className="h-5 w-5" />
            <span>Water Access</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="clean-water"
              checked={healthSocialServices.waterAccess.hasCleanWater}
              onCheckedChange={(checked) => updateNestedField('waterAccess', 'hasCleanWater', !!checked)}
            />
            <label htmlFor="clean-water" className="text-sm font-medium">
              Have access to clean drinking water
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Water Source Type
            </label>
            <Select
              value={healthSocialServices.waterAccess.sourceType}
              onValueChange={(value) => updateNestedField('waterAccess', 'sourceType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="River">River/Stream</SelectItem>
                <SelectItem value="Well">Well (hand-dug)</SelectItem>
                <SelectItem value="Borehole">Borehole/Tube well</SelectItem>
                <SelectItem value="Piped">Piped water system</SelectItem>
                <SelectItem value="Rainwater">Rainwater collection</SelectItem>
                <SelectItem value="Spring">Natural spring</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sanitation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="toilet-available"
              checked={healthSocialServices.sanitation.toiletAvailable}
              onCheckedChange={(checked) => updateNestedField('sanitation', 'toiletAvailable', !!checked)}
            />
            <label htmlFor="toilet-available" className="text-sm font-medium">
              Toilet facility available
            </label>
          </div>

          {healthSocialServices.sanitation.toiletAvailable && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Type of Toilet
              </label>
              <Select
                value={healthSocialServices.sanitation.toiletType}
                onValueChange={(value) => updateNestedField('sanitation', 'toiletType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select toilet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flush">Flush toilet</SelectItem>
                  <SelectItem value="pit-latrine">Pit latrine</SelectItem>
                  <SelectItem value="ventilated-pit">Ventilated improved pit (VIP)</SelectItem>
                  <SelectItem value="composting">Composting toilet</SelectItem>
                  <SelectItem value="shared-facility">Shared community facility</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Health & Social Services Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Nearest Clinic:</strong> {healthSocialServices.accessToHealthServices.nearestClinic || 'Not specified'}</p>
                <p><strong>Distance:</strong> {healthSocialServices.accessToHealthServices.distanceToClinic} km</p>
                <p><strong>Hospital Access:</strong> {healthSocialServices.accessToHealthServices.accessToHospital ? 'Yes' : 'No'}</p>
                <p><strong>Traditional Healer:</strong> {healthSocialServices.accessToHealthServices.traditionalHealer ? 'Available' : 'Not available'}</p>
              </div>
              <div>
                <p><strong>Clean Water:</strong> {healthSocialServices.waterAccess.hasCleanWater ? 'Yes' : 'No'}</p>
                <p><strong>Water Source:</strong> {healthSocialServices.waterAccess.sourceType}</p>
                <p><strong>Toilet Available:</strong> {healthSocialServices.sanitation.toiletAvailable ? 'Yes' : 'No'}</p>
                <p><strong>Chronic Illnesses:</strong> {healthSocialServices.healthStatus.chronicIllness.length} reported</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
