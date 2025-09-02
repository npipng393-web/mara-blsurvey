'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Fingerprint, CheckCircle, XCircle, RotateCcw, Save, User } from 'lucide-react';
import { BiometricData, FingerprintData } from '@/lib/types';

interface BiometricCaptureProps {
  memberName: string;
  memberId: string;
  onBiometricCapture: (biometricData: BiometricData) => void;
  initialData?: BiometricData;
}

export function BiometricCapture({
  memberName,
  memberId,
  onBiometricCapture,
  initialData
}: BiometricCaptureProps) {
  const [biometricData, setBiometricData] = useState<BiometricData>(
    initialData || {
      capturedAt: new Date().toISOString(),
      verificationStatus: 'pending',
      fingerprints: []
    }
  );

  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [isCapturingFingerprint, setIsCapturingFingerprint] = useState(false);
  const [currentFinger, setCurrentFinger] = useState<{ finger: string; hand: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startPhotoCapture = async () => {
    try {
      setIsCapturingPhoto(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions or use file upload instead.');
      setIsCapturingPhoto(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context?.drawImage(video, 0, 0);

      const photoBlob = canvas.toDataURL('image/jpeg', 0.8);

      setBiometricData(prev => ({
        ...prev,
        photoBlob,
        capturedAt: new Date().toISOString()
      }));

      stopPhotoCapture();
    }
  };

  const stopPhotoCapture = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturingPhoto(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoBlob = e.target?.result as string;
        setBiometricData(prev => ({
          ...prev,
          photoBlob,
          capturedAt: new Date().toISOString()
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startFingerprintCapture = (finger: string, hand: string) => {
    setCurrentFinger({ finger, hand });
    setIsCapturingFingerprint(true);
    // In a real implementation, this would interface with fingerprint hardware
    // For now, we'll simulate the capture process
    setTimeout(() => {
      simulateFingerprintCapture(finger, hand);
    }, 2000);
  };

  const simulateFingerprintCapture = (finger: string, hand: string) => {
    // Simulate fingerprint capture - in production this would use actual hardware
    const newFingerprint: FingerprintData = {
      finger: finger as any,
      hand: hand as any,
      template: `template_${finger}_${hand}_${Date.now()}`,
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Placeholder
      quality: Math.floor(Math.random() * 30) + 70, // Random quality 70-100
      capturedAt: new Date().toISOString()
    };

    setBiometricData(prev => ({
      ...prev,
      fingerprints: [
        ...(prev.fingerprints || []).filter(fp => !(fp.finger === finger && fp.hand === hand)),
        newFingerprint
      ]
    }));

    setIsCapturingFingerprint(false);
    setCurrentFinger(null);
  };

  const removeFingerprint = (finger: string, hand: string) => {
    setBiometricData(prev => ({
      ...prev,
      fingerprints: (prev.fingerprints || []).filter(fp => !(fp.finger === finger && fp.hand === hand))
    }));
  };

  const saveBiometricData = () => {
    const completeData = {
      ...biometricData,
      biometricId: `BIO_${memberId}_${Date.now()}`,
      capturedAt: new Date().toISOString()
    };

    setBiometricData(completeData);
    onBiometricCapture(completeData);
  };

  const fingersToCapture = [
    { finger: 'thumb', hand: 'right', label: 'Right Thumb' },
    { finger: 'index', hand: 'right', label: 'Right Index' },
    { finger: 'middle', hand: 'right', label: 'Right Middle' },
    { finger: 'ring', hand: 'right', label: 'Right Ring' },
    { finger: 'pinky', hand: 'right', label: 'Right Pinky' },
    { finger: 'thumb', hand: 'left', label: 'Left Thumb' },
    { finger: 'index', hand: 'left', label: 'Left Index' },
    { finger: 'middle', hand: 'left', label: 'Left Middle' },
    { finger: 'ring', hand: 'left', label: 'Left Ring' },
    { finger: 'pinky', hand: 'left', label: 'Left Pinky' },
  ];

  const getFingerprintStatus = (finger: string, hand: string) => {
    return biometricData.fingerprints?.find(fp => fp.finger === finger && fp.hand === hand);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Biometric Data for {memberName}</span>
          </CardTitle>
          <CardDescription>
            Capture photo and fingerprints for identity verification and program registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Captured By</label>
              <Input
                value={biometricData.capturedBy || ''}
                onChange={(e) => setBiometricData(prev => ({ ...prev, capturedBy: e.target.value }))}
                placeholder="Name of enumerator/officer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Verification Status</label>
              <Select
                value={biometricData.verificationStatus || 'pending'}
                onValueChange={(value) =>
                  setBiometricData(prev => ({ ...prev, verificationStatus: value as 'pending' | 'verified' | 'failed' }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Capture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Photo Capture</span>
          </CardTitle>
          <CardDescription>
            Take a clear photo for identification purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {biometricData.photoBlob ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <img
                  src={biometricData.photoBlob}
                  alt={`Photo of ${memberName}`}
                  className="max-w-xs mx-auto rounded-lg shadow-md"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={startPhotoCapture} variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Photo
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                  Upload New Photo
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {isCapturingPhoto ? (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    className="w-full max-w-md mx-auto rounded-lg border"
                    autoPlay
                    playsInline
                  />
                  <div className="flex justify-center space-x-2">
                    <Button onClick={capturePhoto}>
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button onClick={stopPhotoCapture} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">No photo captured yet</p>
                    <div className="space-x-2">
                      <Button onClick={startPhotoCapture}>
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                      <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                        Upload Photo
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>

      {/* Fingerprint Capture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Fingerprint className="h-5 w-5" />
            <span>Fingerprint Capture</span>
          </CardTitle>
          <CardDescription>
            Capture fingerprints for biometric identification (simulated - requires actual hardware in production)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {fingersToCapture.map(({ finger, hand, label }) => {
              const captured = getFingerprintStatus(finger, hand);
              const isCurrentlyCapturing = isCapturingFingerprint &&
                currentFinger?.finger === finger && currentFinger?.hand === hand;

              return (
                <div key={`${hand}-${finger}`} className="text-center">
                  <Button
                    onClick={() => startFingerprintCapture(finger, hand)}
                    disabled={isCapturingFingerprint}
                    variant={captured ? "default" : "outline"}
                    size="sm"
                    className="w-full h-16 flex flex-col items-center justify-center space-y-1"
                  >
                    {isCurrentlyCapturing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : captured ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Fingerprint className="h-4 w-4" />
                    )}
                    <span className="text-xs">{label}</span>
                    {captured && (
                      <span className="text-xs text-green-600">Q: {captured.quality}%</span>
                    )}
                  </Button>
                  {captured && (
                    <Button
                      onClick={() => removeFingerprint(finger, hand)}
                      variant="ghost"
                      size="sm"
                      className="mt-1 text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {(biometricData.fingerprints?.length || 0) > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ {biometricData.fingerprints?.length} fingerprint(s) captured
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes and Save */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <Textarea
              placeholder="Any additional notes about the biometric capture process..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button onClick={saveBiometricData} disabled={!biometricData.photoBlob}>
              <Save className="h-4 w-4 mr-2" />
              Save Biometric Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
