'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { CRUDTable } from '@/components/ui/CRUDTable';
import { AddEditModal } from '@/components/ui/AddEditModal';
import { campService, Camp } from '@/lib/supabase';

const campColumns = [
  { key: 'name', label: 'Camp Name', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'type', label: 'Type', sortable: true, type: 'badge' as const },
  { key: 'current_population', label: 'Population', sortable: true, type: 'number' as const },
  { key: 'families', label: 'Families', sortable: true, type: 'number' as const },
  { key: 'capacity', label: 'Capacity', sortable: true, type: 'number' as const },
  { key: 'conditions', label: 'Conditions', sortable: true, type: 'badge' as const },
  { key: 'status', label: 'Status', sortable: true, type: 'badge' as const },
  { key: 'actions', label: 'Actions', type: 'actions' as const }
];

const campFormFields = [
  { key: 'name', label: 'Camp Name', type: 'text' as const, required: true },
  { key: 'location', label: 'Location', type: 'text' as const, required: true },
  { key: 'type', label: 'Camp Type', type: 'select' as const, options: ['temporary', 'transitional', 'permanent'], required: true },
  { key: 'established_date', label: 'Established Date', type: 'date' as const, required: true },
  { key: 'capacity', label: 'Capacity', type: 'number' as const, required: true },
  { key: 'current_population', label: 'Current Population', type: 'number' as const, required: true },
  { key: 'families', label: 'Number of Families', type: 'number' as const, required: true },
  { key: 'camp_manager', label: 'Camp Manager', type: 'text' as const, required: true },
  { key: 'facilities', label: 'Facilities (comma separated)', type: 'text' as const, required: false },
  { key: 'conditions', label: 'Camp Conditions', type: 'select' as const, options: ['good', 'fair', 'poor'], required: true },
  { key: 'status', label: 'Status', type: 'select' as const, options: ['active', 'closed', 'planning'], required: true }
];

export function CampManager() {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<Camp | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await campService.getAll();
      setCamps(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load camps');
      console.error('Error loading camps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingCamp(null);
    setIsModalOpen(true);
  };

  const handleEdit = (camp: Camp) => {
    setEditingCamp(camp);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this camp? This action cannot be undone.')) {
      return;
    }

    try {
      await campService.delete(id);
      await loadData(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete camp');
      console.error('Error deleting camp:', err);
    }
  };

  const handleView = (camp: Camp) => {
    console.log('Viewing camp:', camp);
    // TODO: Implement view details modal or navigate to details page
  };

  const handleSave = async (data: Partial<Camp>) => {
    try {
      setError(null);

      // Handle facilities field (convert string to array)
      const processedData = {
        ...data,
        facilities: typeof data.facilities === 'string'
          ? (data.facilities as string).split(',').map((f: string) => f.trim()).filter(f => f.length > 0)
          : (data.facilities as string[]) || []
      };

      if (editingCamp) {
        await campService.update(editingCamp.id, processedData);
      } else {
        await campService.create(processedData as Omit<Camp, 'id' | 'created_at' | 'updated_at'>);
      }

      setIsModalOpen(false);
      setEditingCamp(null);
      await loadData(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save camp');
      console.error('Error saving camp:', err);
    }
  };

  const actions = [
    { label: 'View', icon: Eye, onClick: handleView, variant: 'outline' as const },
    { label: 'Edit', icon: Edit2, onClick: handleEdit, variant: 'outline' as const },
    { label: 'Delete', icon: Trash2, onClick: (item: Camp) => handleDelete(item.id), variant: 'destructive' as const }
  ];

  const activeCamps = camps.filter(c => c.status === 'active');
  const totalCapacity = camps.reduce((sum, c) => sum + c.capacity, 0);
  const totalPopulation = camps.reduce((sum, c) => sum + c.current_population, 0);
  const occupancyRate = totalCapacity > 0 ? (totalPopulation / totalCapacity * 100).toFixed(1) : '0';

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-red-600 mb-4">Error: {error}</div>
              <Button onClick={loadData}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="list">Camp List</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Camp
          </Button>
        </div>

        <TabsContent value="list" className="flex-1">
          <CRUDTable
            data={camps}
            columns={campColumns}
            actions={actions}
            loading={loading}
            searchPlaceholder="Search camps..."
          />
        </TabsContent>

        <TabsContent value="statistics" className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader><CardTitle>Total Camps</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{camps.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Active Camps</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{activeCamps.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Population</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{totalPopulation}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Occupancy Rate</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{occupancyRate}%</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Camp Types</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Temporary:</span>
                    <span className="font-medium">{camps.filter(c => c.type === 'temporary').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transitional:</span>
                    <span className="font-medium">{camps.filter(c => c.type === 'transitional').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Permanent:</span>
                    <span className="font-medium">{camps.filter(c => c.type === 'permanent').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Camp Conditions</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Good:</span>
                    <span className="font-medium">{camps.filter(c => c.conditions === 'good').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fair:</span>
                    <span className="font-medium">{camps.filter(c => c.conditions === 'fair').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Poor:</span>
                    <span className="font-medium">{camps.filter(c => c.conditions === 'poor').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="facilities" className="flex-1">
          <div className="space-y-6">
            {camps.map((camp) => (
              <Card key={camp.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{camp.name}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      camp.status === 'active' ? 'bg-green-100 text-green-800' :
                      camp.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {camp.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Location</div>
                      <div className="font-medium">{camp.location}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Population</div>
                      <div className="font-medium">{camp.current_population} / {camp.capacity}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Facilities</div>
                      <div className="font-medium">{camp.facilities.join(', ') || 'Not specified'}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="management" className="flex-1">
          <div className="space-y-6">
            {camps.map((camp) => (
              <Card key={camp.id}>
                <CardHeader>
                  <CardTitle>{camp.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Camp Manager:</span>
                          <span className="font-medium">{camp.camp_manager}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Established:</span>
                          <span className="font-medium">{camp.established_date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-medium capitalize">{camp.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conditions:</span>
                          <span className={`font-medium capitalize ${
                            camp.conditions === 'good' ? 'text-green-600' :
                            camp.conditions === 'fair' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {camp.conditions}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Families:</span>
                          <span className="font-medium">{camp.families}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Population:</span>
                          <span className="font-medium">{camp.current_population}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Capacity:</span>
                          <span className="font-medium">{camp.capacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Occupancy:</span>
                          <span className="font-medium">
                            {camp.capacity > 0 ? ((camp.current_population / camp.capacity) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCamp(null);
        }}
        onSave={handleSave}
        title={editingCamp ? 'Edit Camp' : 'Add Camp'}
        fields={campFormFields}
        initialData={editingCamp ? {
          ...editingCamp,
          facilities: editingCamp.facilities.join(', ')
        } : {}}
      />
    </div>
  );
}
