'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { CRUDTable } from '@/components/ui/CRUDTable';
import { AddEditModal } from '@/components/ui/AddEditModal';
import { villageService, wardService, Village, Ward } from '@/lib/supabase';

const villageColumns = [
  { key: 'name', label: 'Village Name', sortable: true },
  { key: 'ward_name', label: 'Ward', sortable: true },
  { key: 'chief', label: 'Village Chief', sortable: true },
  { key: 'population', label: 'Population', sortable: true, type: 'number' as const },
  { key: 'households', label: 'Households', sortable: true, type: 'number' as const },
  { key: 'water_source', label: 'Water Source', sortable: true },
  { key: 'status', label: 'Status', sortable: true, type: 'badge' as const },
  { key: 'actions', label: 'Actions', type: 'actions' as const }
];

export function VillageManager() {
  const [villages, setVillages] = useState<Village[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVillage, setEditingVillage] = useState<Village | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  // Dynamic form fields that depend on loaded wards
  const getVillageFormFields = () => [
    { key: 'name', label: 'Village Name', type: 'text' as const, required: true },
    {
      key: 'ward_id',
      label: 'Ward',
      type: 'select' as const,
      options: wards.map(w => ({ value: w.id, label: `Ward ${w.ward_number} - ${w.name}` })),
      required: true
    },
    { key: 'chief', label: 'Village Chief', type: 'text' as const, required: true },
    { key: 'population', label: 'Population', type: 'number' as const, required: true },
    { key: 'households', label: 'Number of Households', type: 'number' as const, required: true },
    { key: 'languages', label: 'Local Languages (comma separated)', type: 'text' as const, required: false },
    { key: 'water_source', label: 'Water Source', type: 'select' as const, options: ['Well', 'River', 'Spring', 'Rainwater', 'Piped Water'], required: true },
    { key: 'access_road', label: 'Has Access Road', type: 'checkbox' as const, required: false },
    { key: 'electricity', label: 'Has Electricity', type: 'checkbox' as const, required: false },
    { key: 'health_facility', label: 'Has Health Facility', type: 'checkbox' as const, required: false },
    { key: 'school', label: 'Has School', type: 'checkbox' as const, required: false },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['active', 'inactive'], required: true }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [villagesData, wardsData] = await Promise.all([
        villageService.getAll(),
        wardService.getAll()
      ]);
      setVillages(villagesData);
      setWards(wardsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingVillage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (village: Village) => {
    setEditingVillage(village);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this village? This action cannot be undone.')) {
      return;
    }

    try {
      await villageService.delete(id);
      await loadData(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete village');
      console.error('Error deleting village:', err);
    }
  };

  const handleView = (village: Village) => {
    console.log('Viewing village:', village);
    // TODO: Implement view details modal or navigate to details page
  };

  const handleSave = async (data: Partial<Village>) => {
    try {
      setError(null);

      // Handle languages field (convert string to array)
      const processedData = {
        ...data,
        languages: typeof data.languages === 'string'
          ? (data.languages as string).split(',').map((l: string) => l.trim()).filter(l => l.length > 0)
          : (data.languages as string[]) || []
      };

      if (editingVillage) {
        await villageService.update(editingVillage.id, processedData);
      } else {
        await villageService.create(processedData as Omit<Village, 'id' | 'created_at' | 'updated_at'>);
      }

      setIsModalOpen(false);
      setEditingVillage(null);
      await loadData(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save village');
      console.error('Error saving village:', err);
    }
  };

  const actions = [
    { label: 'View', icon: Eye, onClick: handleView, variant: 'outline' as const },
    { label: 'Edit', icon: Edit2, onClick: handleEdit, variant: 'outline' as const },
    { label: 'Delete', icon: Trash2, onClick: (item: Village) => handleDelete(item.id), variant: 'destructive' as const }
  ];

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
            <TabsTrigger value="list">Village List</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="culture">Culture & Language</TabsTrigger>
          </TabsList>
          <Button onClick={handleAdd} disabled={wards.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Add Village
          </Button>
        </div>

        <TabsContent value="list" className="flex-1">
          <CRUDTable
            data={villages}
            columns={villageColumns}
            actions={actions}
            loading={loading}
            searchPlaceholder="Search villages..."
          />
        </TabsContent>

        <TabsContent value="statistics" className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader><CardTitle>Total Villages</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{villages.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Population</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {villages.reduce((sum, v) => sum + v.population, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Households</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {villages.reduce((sum, v) => sum + v.households, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Avg. HH Size</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {villages.length > 0 && villages.reduce((sum, v) => sum + v.households, 0) > 0 ?
                    (villages.reduce((sum, v) => sum + v.population, 0) /
                    villages.reduce((sum, v) => sum + v.households, 0)).toFixed(1) : '0'}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Infrastructure Access</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Villages with Road Access:</span>
                    <span className="font-medium">
                      {villages.filter(v => v.access_road).length} / {villages.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Villages with Electricity:</span>
                    <span className="font-medium">
                      {villages.filter(v => v.electricity).length} / {villages.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Villages with Schools:</span>
                    <span className="font-medium">
                      {villages.filter(v => v.school).length} / {villages.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Villages with Health Facilities:</span>
                    <span className="font-medium">
                      {villages.filter(v => v.health_facility).length} / {villages.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Water Sources</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['Well', 'River', 'Spring', 'Rainwater', 'Piped Water'].map(source => {
                    const count = villages.filter(v => v.water_source === source).length;
                    return count > 0 ? (
                      <div key={source} className="flex justify-between">
                        <span>{source}:</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="culture" className="flex-1">
          <Card>
            <CardHeader><CardTitle>Cultural & Linguistic Diversity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {villages.map((village) => (
                  <div key={village.id} className="p-4 bg-gray-50 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{village.name}</div>
                        <div className="text-sm text-gray-600">Chief: {village.chief}</div>
                        <div className="text-sm text-gray-600">
                          Languages: {village.languages.join(', ') || 'Not specified'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Population</div>
                        <div className="font-medium">{village.population}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVillage(null);
        }}
        onSave={handleSave}
        title={editingVillage ? 'Edit Village' : 'Add Village'}
        fields={getVillageFormFields()}
        initialData={editingVillage ? {
          ...editingVillage,
          languages: editingVillage.languages.join(', ')
        } : {}}
      />
    </div>
  );
}
