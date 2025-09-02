'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Plus, Trash2, Calendar } from 'lucide-react';
import { SurveyFormData, CurrentLocation } from '@/lib/types';

interface LocationFormProps {
  data: SurveyFormData;
  onUpdate: (data: Partial<SurveyFormData>) => void;
}

export function LocationForm({ data, onUpdate }: LocationFormProps) {
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation>({
    campVillageName: data.currentLocation?.campVillageName || '',
    gpsCoordinates: data.currentLocation?.gpsCoordinates || { latitude: 0, longitude: 0 },
    yearMoved: data.currentLocation?.yearMoved || new Date().getFullYear(),
    previousLocations: data.currentLocation?.previousLocations || [],
    shelterType: data.currentLocation?.shelterType || 'Temporary hut',
    shelterDescription: data.currentLocation?.shelterDescription || '',
  });

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [newPreviousLocation, setNewPreviousLocation] = useState('');

  useEffect(() => {
    onUpdate({ currentLocation });
  }, [currentLocation, onUpdate]);

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation(prev => ({
          ...prev,
          gpsCoordinates: {
            latitude: parseFloat(position.coords.latitude.toFixed(6)),
            longitude: parseFloat(position.coords.longitude.toFixed(6))
          }
        }));
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get current location. Please enter coordinates manually.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const addPreviousLocation = () => {
    if (newPreviousLocation.trim()) {
      setCurrentLocation(prev => ({
        ...prev,
        previousLocations: [...prev.previousLocations, newPreviousLocation.trim()]
      }));
      setNewPreviousLocation('');
    }
  };

  const removePreviousLocation = (index: number) => {
    setCurrentLocation(prev => ({
      ...prev,
      previousLocations: prev.previousLocations.filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: keyof CurrentLocation, value: any) => {
    setCurrentLocation(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Current Location Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Camp/Village Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={currentLocation.campVillageName}
                onChange={(e) => updateField('campVillageName', e.target.value)}
                placeholder="e.g., Ponam Island, Boesa Care Centre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Year Moved to Current Location
              </label>
              <Input
                type="number"
                min="2004"
                max={new Date().getFullYear()}
                value={currentLocation.yearMoved}
                onChange={(e) => updateField('yearMoved', parseInt(e.target.value) || new Date().getFullYear())}
                placeholder="Year"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="h-5 w-5" />
            <span>GPS Coordinates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Latitude</label>
              <Input
                type="number"
                step="0.000001"
                value={currentLocation.gpsCoordinates.latitude || ''}
                onChange={(e) => updateField('gpsCoordinates', {
                  ...currentLocation.gpsCoordinates,
                  latitude: parseFloat(e.target.value) || 0
                })}
                placeholder="e.g., -4.123456"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Longitude</label>
              <Input
                type="number"
                step="0.000001"
                value={currentLocation.gpsCoordinates.longitude || ''}
                onChange={(e) => updateField('gpsCoordinates', {
                  ...currentLocation.gpsCoordinates,
                  longitude: parseFloat(e.target.value) || 0
                })}
                placeholder="e.g., 145.123456"
              />
            </div>
            <div>
              <Button
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="w-full"
              >
                {isGettingLocation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Getting Location...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Current GPS
                  </>
                )}
              </Button>
            </div>
          </div>

          {currentLocation.gpsCoordinates.latitude !== 0 && currentLocation.gpsCoordinates.longitude !== 0 && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                📍 Current coordinates: {currentLocation.gpsCoordinates.latitude.toFixed(6)}, {currentLocation.gpsCoordinates.longitude.toFixed(6)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                <a
                  href={`https://www.google.com/maps?q=${currentLocation.gpsCoordinates.latitude},${currentLocation.gpsCoordinates.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-700"
                >
                  View on Google Maps
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Displacement History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Previous Resettlement Locations (since 2004 eruption)
            </label>
            <p className="text-sm text-gray-600 mb-3">
              List all locations where this household has lived since being displaced from Manam Island.
            </p>

            <div className="space-y-2">
              {currentLocation.previousLocations.map((location, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-600">
                    {index + 1}.
                  </span>
                  <span className="flex-1">{location}</span>
                  <Button
                    onClick={() => removePreviousLocation(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {currentLocation.previousLocations.length === 0 && (
                <p className="text-sm text-gray-500 italic py-4 text-center">
                  No previous locations recorded
                </p>
              )}
            </div>

            <div className="flex space-x-2 mt-3">
              <Input
                value={newPreviousLocation}
                onChange={(e) => setNewPreviousLocation(e.target.value)}
                placeholder="Enter previous location name"
                onKeyPress={(e) => e.key === 'Enter' && addPreviousLocation()}
              />
              <Button
                onClick={addPreviousLocation}
                disabled={!newPreviousLocation.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Shelter Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Type of Shelter <span className="text-red-500">*</span>
            </label>
            <Select
              value={currentLocation.shelterType}
              onValueChange={(value: any) => updateField('shelterType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Temporary hut">Temporary hut</SelectItem>
                <SelectItem value="Permanent house">Permanent house</SelectItem>
                <SelectItem value="Semi-permanent">Semi-permanent</SelectItem>
                <SelectItem value="Traditional house">Traditional house</SelectItem>
                <SelectItem value="Government housing">Government housing</SelectItem>
                <SelectItem value="Church facility">Church facility</SelectItem>
                <SelectItem value="School building">School building</SelectItem>
                <SelectItem value="Community center">Community center</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Shelter Description
            </label>
            <Textarea
              value={currentLocation.shelterDescription}
              onChange={(e) => updateField('shelterDescription', e.target.value)}
              placeholder="Describe the current shelter conditions, materials used, size, accessibility, etc."
              rows={4}
            />
            <p className="text-sm text-gray-600 mt-1">
              Include details about: construction materials, number of rooms, water access, electricity, condition, etc.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Location Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Current Location:</strong> {currentLocation.campVillageName || 'Not specified'}</p>
                <p><strong>Moved in:</strong> {currentLocation.yearMoved}</p>
                <p><strong>Shelter Type:</strong> {currentLocation.shelterType}</p>
              </div>
              <div>
                <p><strong>GPS:</strong> {
                  currentLocation.gpsCoordinates.latitude && currentLocation.gpsCoordinates.longitude
                    ? `${currentLocation.gpsCoordinates.latitude.toFixed(6)}, ${currentLocation.gpsCoordinates.longitude.toFixed(6)}`
                    : 'Not captured'
                }</p>
                <p><strong>Previous Locations:</strong> {currentLocation.previousLocations.length} recorded</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
