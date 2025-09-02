'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { CRUDTable } from '@/components/ui/CRUDTable';
import { AddEditModal } from '@/components/ui/AddEditModal';
import { llgService, districtService, LLG, District } from '@/lib/supabase';

const llgColumns = [
  { key: 'code', label: 'LLG Code', sortable: true },
  { key: 'name', label: 'LLG Name', sortable: true },
  { key: 'district_name', label: 'District', sortable: true },
  { key: 'type', label: 'Type', sortable: true, type: 'badge' as const },
  { key: 'wards_count', label: 'Wards', sortable: true, type: 'number' as const },
  { key: 'population', label: 'Population', sortable: true, type: 'number' as const },
  { key: 'president', label: 'President', sortable: true },
  { key: 'status', label: 'Status', sortable: true, type: 'badge' as const },
  { key: 'actions', label: 'Actions', type: 'actions' as const }
];

export function LLGManager() {
  const [llgs, setLlgs] = useState<LLG[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLlg, setEditingLlg] = useState<LLG | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  // Dynamic form fields that depend on loaded districts
  const getLlgFormFields = () => [
    { key: 'name', label: 'LLG Name', type: 'text' as const, required: true },
    { key: 'code', label: 'LLG Code', type: 'text' as const, required: true },
    {
      key: 'district_id',
      label: 'District',
      type: 'select' as const,
      options: districts.map(d => ({ value: d.id, label: d.name })),
      required: true
    },
    { key: 'type', label: 'Type', type: 'select' as const, options: ['urban', 'rural'], required: true },
    { key: 'wards_count', label: 'Number of Wards', type: 'number' as const, required: true },
    { key: 'population', label: 'Population', type: 'number' as const, required: true },
    { key: 'president', label: 'LLG President', type: 'text' as const, required: true },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['active', 'inactive'], required: true }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [llgsData, districtsData] = await Promise.all([
        llgService.getAll(),
        districtService.getAll()
      ]);
      setLlgs(llgsData);
      setDistricts(districtsData);
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
    setEditingLlg(null);
    setIsModalOpen(true);
  };

  const handleEdit = (llg: LLG) => {
    setEditingLlg(llg);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this LLG? This action cannot be undone.')) {
      return;
    }

    try {
      await llgService.delete(id);
      await loadData(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete LLG');
      console.error('Error deleting LLG:', err);
    }
  };

  const handleView = (llg: LLG) => {
    console.log('Viewing LLG:', llg);
    // TODO: Implement view details modal or navigate to details page
  };

  const handleSave = async (data: Partial<LLG>) => {
    try {
      setError(null);
      if (editingLlg) {
        await llgService.update(editingLlg.id, data);
      } else {
        await llgService.create(data as Omit<LLG, 'id' | 'created_at' | 'updated_at'>);
      }

      setIsModalOpen(false);
      setEditingLlg(null);
      await loadData(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save LLG');
      console.error('Error saving LLG:', err);
    }
  };

  const actions = [
    { label: 'View', icon: Eye, onClick: handleView, variant: 'outline' as const },
    { label: 'Edit', icon: Edit2, onClick: handleEdit, variant: 'outline' as const },
    { label: 'Delete', icon: Trash2, onClick: (item: LLG) => handleDelete(item.id), variant: 'destructive' as const }
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
            <TabsTrigger value="list">LLG List</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          <Button onClick={handleAdd} disabled={districts.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Add LLG
          </Button>
        </div>

        <TabsContent value="list" className="flex-1">
          <CRUDTable
            data={llgs}
            columns={llgColumns}
            actions={actions}
            loading={loading}
            searchPlaceholder="Search LLGs..."
          />
        </TabsContent>

        <TabsContent value="statistics" className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader><CardTitle>Total LLGs</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{llgs.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Urban LLGs</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {llgs.filter(l => l.type === 'urban').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Rural LLGs</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {llgs.filter(l => l.type === 'rural').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Wards</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {llgs.reduce((sum, l) => sum + l.wards_count, 0)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="governance" className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>LLG Presidents</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {llgs.map((llg) => (
                    <div key={llg.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{llg.name}</div>
                        <div className="text-sm text-gray-600">{llg.president}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{llg.type}</div>
                        <div className="font-medium">{llg.population.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Governance Structure</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Wards:</span>
                    <span className="font-medium">{llgs.reduce((sum, l) => sum + l.wards_count, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Wards per LLG:</span>
                    <span className="font-medium">
                      {llgs.length > 0 ? Math.round(llgs.reduce((sum, l) => sum + l.wards_count, 0) / llgs.length) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Population:</span>
                    <span className="font-medium">{llgs.reduce((sum, l) => sum + l.population, 0).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="flex-1">
          <Card>
            <CardHeader><CardTitle>LLG Services Overview</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded text-center">
                  <div className="text-2xl font-bold text-blue-600">{llgs.length}</div>
                  <div className="text-sm text-gray-600">Total LLGs</div>
                </div>
                <div className="p-4 bg-green-50 rounded text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {llgs.reduce((sum, l) => sum + l.wards_count, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Wards</div>
                </div>
                <div className="p-4 bg-orange-50 rounded text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {llgs.reduce((sum, l) => sum + l.population, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Population</div>
                </div>
                <div className="p-4 bg-purple-50 rounded text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {llgs.length > 0 ? Math.round(llgs.reduce((sum, l) => sum + l.population, 0) / llgs.length).toLocaleString() : 0}
                  </div>
                  <div className="text-sm text-gray-600">Avg Population</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLlg(null);
        }}
        onSave={handleSave}
        title={editingLlg ? 'Edit LLG' : 'Add LLG'}
        fields={getLlgFormFields()}
        initialData={editingLlg || {}}
      />
    </div>
  );
}
