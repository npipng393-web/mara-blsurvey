'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { CRUDTable } from '@/components/ui/CRUDTable';
import { AddEditModal } from '@/components/ui/AddEditModal';
import { wardService, llgService, Ward, LLG } from '@/lib/supabase';

const wardColumns = [
  { key: 'ward_number', label: 'Ward #', sortable: true, type: 'number' as const },
  { key: 'name', label: 'Ward Name', sortable: true },
  { key: 'llg_name', label: 'LLG', sortable: true },
  { key: 'councillor', label: 'Councillor', sortable: true },
  { key: 'villages_count', label: 'Villages', sortable: true, type: 'number' as const },
  { key: 'population', label: 'Population', sortable: true, type: 'number' as const },
  { key: 'status', label: 'Status', sortable: true, type: 'badge' as const },
  { key: 'actions', label: 'Actions', type: 'actions' as const }
];

export function WardManager() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [llgs, setLlgs] = useState<LLG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWard, setEditingWard] = useState<Ward | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  // Dynamic form fields that depend on loaded LLGs
  const getWardFormFields = () => [
    { key: 'name', label: 'Ward Name', type: 'text' as const, required: true },
    { key: 'ward_number', label: 'Ward Number', type: 'number' as const, required: true },
    {
      key: 'llg_id',
      label: 'LLG',
      type: 'select' as const,
      options: llgs.map(l => ({ value: l.id, label: l.name })),
      required: true
    },
    { key: 'councillor', label: 'Ward Councillor', type: 'text' as const, required: true },
    { key: 'villages_count', label: 'Number of Villages', type: 'number' as const, required: true },
    { key: 'population', label: 'Population', type: 'number' as const, required: true },
    { key: 'area_sq_km', label: 'Area (km²)', type: 'number' as const, required: true },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['active', 'inactive'], required: true }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [wardsData, llgsData] = await Promise.all([
        wardService.getAll(),
        llgService.getAll()
      ]);
      setWards(wardsData);
      setLlgs(llgsData);
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
    setEditingWard(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ward: Ward) => {
    setEditingWard(ward);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ward? This action cannot be undone.')) {
      return;
    }

    try {
      await wardService.delete(id);
      await loadData(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ward');
      console.error('Error deleting ward:', err);
    }
  };

  const handleView = (ward: Ward) => {
    console.log('Viewing ward:', ward);
    // TODO: Implement view details modal or navigate to details page
  };

  const handleSave = async (data: Partial<Ward>) => {
    try {
      setError(null);
      if (editingWard) {
        await wardService.update(editingWard.id, data);
      } else {
        await wardService.create(data as Omit<Ward, 'id' | 'created_at' | 'updated_at'>);
      }

      setIsModalOpen(false);
      setEditingWard(null);
      await loadData(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ward');
      console.error('Error saving ward:', err);
    }
  };

  const actions = [
    { label: 'View', icon: Eye, onClick: handleView, variant: 'outline' as const },
    { label: 'Edit', icon: Edit2, onClick: handleEdit, variant: 'outline' as const },
    { label: 'Delete', icon: Trash2, onClick: (item: Ward) => handleDelete(item.id), variant: 'destructive' as const }
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
            <TabsTrigger value="list">Ward List</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="councillors">Councillors</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
          </TabsList>
          <Button onClick={handleAdd} disabled={llgs.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Add Ward
          </Button>
        </div>

        <TabsContent value="list" className="flex-1">
          <CRUDTable
            data={wards}
            columns={wardColumns}
            actions={actions}
            loading={loading}
            searchPlaceholder="Search wards..."
          />
        </TabsContent>

        <TabsContent value="statistics" className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader><CardTitle>Total Wards</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{wards.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Population</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {wards.reduce((sum, w) => sum + w.population, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Villages</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {wards.reduce((sum, w) => sum + w.villages_count, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Area</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {wards.reduce((sum, w) => sum + w.area_sq_km, 0).toFixed(1)} km²
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="councillors" className="flex-1">
          <Card>
            <CardHeader><CardTitle>Ward Councillors</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wards.map((ward) => (
                  <div key={ward.id} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">Ward {ward.ward_number} - {ward.name}</div>
                      <div className="text-sm text-gray-600">Councillor: {ward.councillor}</div>
                      <div className="text-sm text-gray-600">{ward.llg_name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Population</div>
                      <div className="font-medium">{ward.population.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="development" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Development Overview</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded">
                    <div className="font-medium text-green-800">Infrastructure Development</div>
                    <div className="text-sm text-green-600">Based on ward data analysis</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="font-medium text-blue-800">Service Distribution</div>
                    <div className="text-sm text-blue-600">Across {wards.length} wards</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded">
                    <div className="font-medium text-orange-800">Population Distribution</div>
                    <div className="text-sm text-orange-600">{wards.reduce((sum, w) => sum + w.population, 0).toLocaleString()} total residents</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Ward Statistics</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Average Population per Ward:</span>
                    <span className="font-medium">
                      {wards.length > 0 ? Math.round(wards.reduce((sum, w) => sum + w.population, 0) / wards.length).toLocaleString() : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Villages per Ward:</span>
                    <span className="font-medium">
                      {wards.length > 0 ? Math.round(wards.reduce((sum, w) => sum + w.villages_count, 0) / wards.length) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Area per Ward:</span>
                    <span className="font-medium">
                      {wards.length > 0 ? (wards.reduce((sum, w) => sum + w.area_sq_km, 0) / wards.length).toFixed(1) : 0} km²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Population Density:</span>
                    <span className="font-medium">
                      {wards.length > 0 ? Math.round(wards.reduce((sum, w) => sum + w.population, 0) / wards.reduce((sum, w) => sum + w.area_sq_km, 0)).toLocaleString() : 0} people/km²
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingWard(null);
        }}
        onSave={handleSave}
        title={editingWard ? 'Edit Ward' : 'Add Ward'}
        fields={getWardFormFields()}
        initialData={editingWard || {}}
      />
    </div>
  );
}
