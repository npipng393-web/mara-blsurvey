'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users, Camera, Fingerprint, CheckCircle, AlertCircle } from 'lucide-react';
import { BiometricCapture } from '../BiometricCapture';
import { SurveyFormData, BiometricsInformation, BiometricData } from '@/lib/types';

interface BiometricsFormProps {
  data: SurveyFormData;
  onUpdate: (data: Partial<SurveyFormData>) => void;
}

export function BiometricsForm({ data, onUpdate }: BiometricsFormProps) {
  const [biometricsInfo, setBiometricsInfo] = useState<BiometricsInformation>({
    householdId: data.demographicInfo?.householdId || '',
    memberBiometrics: [],
    capturedBy: '',
    captureDate: new Date().toISOString().split('T')[0],
    captureDevice: 'Web Camera + Simulated Fingerprint Scanner',
    captureLocation: '',
    notes: '',
    ...data.biometricsInfo
  });

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showCapture, setShowCapture] = useState(false);

  const householdMembers = data.demographicInfo?.members || [];

  useEffect(() => {
    onUpdate({ biometricsInfo });
  }, [biometricsInfo, onUpdate]);

  const handleBiometricCapture = (memberId: string, biometricData: BiometricData) => {
    const member = householdMembers.find(m => m.id === memberId);
    if (!member) return;

    setBiometricsInfo(prev => ({
      ...prev,
      memberBiometrics: [
        ...prev.memberBiometrics.filter(mb => mb.memberId !== memberId),
        {
          memberId,
          memberName: member.fullName,
          biometricData
        }
      ]
    }));

    setShowCapture(false);
    setSelectedMember(null);
  };

  const getBiometricStatus = (memberId: string) => {
    const memberBio = biometricsInfo.memberBiometrics.find(mb => mb.memberId === memberId);
    if (!memberBio) return 'not_captured';

    const hasPhoto = !!memberBio.biometricData.photoBlob;
    const fingerprintCount = memberBio.biometricData.fingerprints?.length || 0;

    if (hasPhoto && fingerprintCount >= 2) return 'complete';
    if (hasPhoto || fingerprintCount > 0) return 'partial';
    return 'not_captured';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-600 bg-green-50';
      case 'partial': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  if (showCapture && selectedMember) {
    const member = householdMembers.find(m => m.id === selectedMember);
    if (!member) return null;

    const existingBiometric = biometricsInfo.memberBiometrics.find(
      mb => mb.memberId === selectedMember
    )?.biometricData;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Capturing Biometrics</h3>
          <Button
            variant="outline"
            onClick={() => {
              setShowCapture(false);
              setSelectedMember(null);
            }}
          >
            Back to Member List
          </Button>
        </div>

        <BiometricCapture
          memberName={member.fullName}
          memberId={member.id}
          initialData={existingBiometric}
          onBiometricCapture={(biometricData) => handleBiometricCapture(member.id, biometricData)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Fingerprint className="h-5 w-5" />
            <span>Biometric Data Collection</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Household ID</label>
              <Input
                value={biometricsInfo.householdId}
                onChange={(e) => setBiometricsInfo(prev => ({ ...prev, householdId: e.target.value }))}
                placeholder="Household ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Capture Date</label>
              <Input
                type="date"
                value={biometricsInfo.captureDate}
                onChange={(e) => setBiometricsInfo(prev => ({ ...prev, captureDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Captured By</label>
              <Input
                value={biometricsInfo.capturedBy}
                onChange={(e) => setBiometricsInfo(prev => ({ ...prev, capturedBy: e.target.value }))}
                placeholder="Name of enumerator/officer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Capture Location</label>
              <Input
                value={biometricsInfo.captureLocation}
                onChange={(e) => setBiometricsInfo(prev => ({ ...prev, captureLocation: e.target.value }))}
                placeholder="Location where biometrics were captured"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Capture Device</label>
            <Select
              value={biometricsInfo.captureDevice}
              onValueChange={(value) => setBiometricsInfo(prev => ({ ...prev, captureDevice: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Web Camera + Simulated Fingerprint Scanner">Web Camera + Simulated Scanner</SelectItem>
                <SelectItem value="Mobile Device Camera + Fingerprint Scanner">Mobile Device + Scanner</SelectItem>
                <SelectItem value="Digital Camera + Professional Fingerprint Scanner">Digital Camera + Professional Scanner</SelectItem>
                <SelectItem value="Integrated Biometric Terminal">Integrated Biometric Terminal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <Textarea
              value={biometricsInfo.notes}
              onChange={(e) => setBiometricsInfo(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes about the biometric capture process..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Household Members - Biometric Status</CardTitle>
        </CardHeader>
        <CardContent>
          {householdMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No household members found.</p>
              <p className="text-sm">Please complete the demographic information first.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {householdMembers.map((member) => {
                const status = getBiometricStatus(member.id);
                const memberBio = biometricsInfo.memberBiometrics.find(mb => mb.memberId === member.id);

                return (
                  <div key={member.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(status)}
                        <div>
                          <h4 className="font-medium">{member.fullName}</h4>
                          <p className="text-sm text-gray-600">
                            {member.relationshipToHead} • Age {member.age}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {status === 'complete' && '✓ Complete'}
                          {status === 'partial' && '⚠ Partial'}
                          {status === 'not_captured' && '○ Not Started'}
                        </div>

                        <Button
                          onClick={() => {
                            setSelectedMember(member.id);
                            setShowCapture(true);
                          }}
                          size="sm"
                          variant={status === 'complete' ? 'outline' : 'default'}
                        >
                          {status === 'not_captured' ? (
                            <>
                              <Camera className="h-4 w-4 mr-2" />
                              Start Capture
                            </>
                          ) : (
                            <>
                              <Camera className="h-4 w-4 mr-2" />
                              Edit/Review
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {memberBio && (
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 border-t pt-3">
                        <div>
                          <span className="font-medium">Photo:</span> {memberBio.biometricData.photoBlob ? '✓' : '✗'}
                        </div>
                        <div>
                          <span className="font-medium">Fingerprints:</span> {memberBio.biometricData.fingerprints?.length || 0}/10
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {memberBio.biometricData.verificationStatus}
                        </div>
                        <div>
                          <span className="font-medium">Captured:</span> {
                            memberBio.biometricData.capturedAt
                              ? new Date(memberBio.biometricData.capturedAt).toLocaleDateString()
                              : 'N/A'
                          }
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {householdMembers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {biometricsInfo.memberBiometrics.filter(mb =>
                    getBiometricStatus(mb.memberId) === 'complete'
                  ).length}
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {biometricsInfo.memberBiometrics.filter(mb =>
                    getBiometricStatus(mb.memberId) === 'partial'
                  ).length}
                </div>
                <div className="text-sm text-gray-600">Partial</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {householdMembers.length - biometricsInfo.memberBiometrics.length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
