'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { CRUDTable } from '@/components/ui/CRUDTable';
import { AddEditModal } from '@/components/ui/AddEditModal';
import { provinceService, Province } from '@/lib/supabase';

const provinceColumns = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'name', label: 'Province Name', sortable: true },
  { key: 'capital', label: 'Capital', sortable: true },
  { key: 'population', label: 'Population', sortable: true, type: 'number' as const },
  { key: 'area_sq_km', label: 'Area (km²)', sortable: true, type: 'number' as const },
  { key: 'status', label: 'Status', sortable: true, type: 'badge' as const },
  { key: 'actions', label: 'Actions', type: 'actions' as const }
];

const provinceFormFields = [
  { key: 'name', label: 'Province Name', type: 'text' as const, required: true },
  { key: 'code', label: 'Province Code', type: 'text' as const, required: true },
  { key: 'capital', label: 'Capital City', type: 'text' as const, required: true },
  { key: 'population', label: 'Population', type: 'number' as const, required: true },
  { key: 'area_sq_km', label: 'Area (km²)', type: 'number' as const, required: true },
  { key: 'status', label: 'Status', type: 'select' as const, options: ['active', 'inactive'], required: true }
];

export function ProvinceManager() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvince, setEditingProvince] = useState<Province | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  const loadProvinces = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await provinceService.getAll();
      setProvinces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load provinces');
      console.error('Error loading provinces:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProvinces();
  }, []);

  const handleAdd = () => {
    setEditingProvince(null);
    setIsModalOpen(true);
  };

  const handleEdit = (province: Province) => {
    setEditingProvince(province);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this province? This action cannot be undone.')) {
      return;
    }

    try {
      await provinceService.delete(id);
      await loadProvinces(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete province');
      console.error('Error deleting province:', err);
    }
  };

  const handleView = (province: Province) => {
    console.log('Viewing province:', province);
    // TODO: Implement view details modal or navigate to details page
  };

  const handleSave = async (data: Partial<Province>) => {
    try {
      setError(null);
      if (editingProvince) {
        await provinceService.update(editingProvince.id, data);
      } else {
        await provinceService.create(data as Omit<Province, 'id' | 'created_at' | 'updated_at'>);
      }

      setIsModalOpen(false);
      setEditingProvince(null);
      await loadProvinces(); // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save province');
      console.error('Error saving province:', err);
    }
  };

  const actions = [
    { label: 'View', icon: Eye, onClick: handleView, variant: 'outline' as const },
    { label: 'Edit', icon: Edit2, onClick: handleEdit, variant: 'outline' as const },
    { label: 'Delete', icon: Trash2, onClick: (item: Province) => handleDelete(item.id), variant: 'destructive' as const }
  ];

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-red-600 mb-4">Error: {error}</div>
              <Button onClick={loadProvinces}>Retry</Button>
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
            <TabsTrigger value="list">Province List</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="mapping">Geographic Mapping</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Province
          </Button>
        </div>

        <TabsContent value="list" className="flex-1">
          <CRUDTable
            data={provinces}
            columns={provinceColumns}
            actions={actions}
            loading={loading}
            searchPlaceholder="Search provinces..."
          />
        </TabsContent>

        <TabsContent value="statistics" className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Provinces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {provinces.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Population</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {provinces.reduce((sum, p) => sum + p.population, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Area</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {provinces.reduce((sum, p) => sum + p.area_sq_km, 0).toLocaleString()} km²
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mapping" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Map visualization would be integrated here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Province Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Generate Population Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Generate Geographic Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Generate Administrative Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProvince(null);
        }}
        onSave={handleSave}
        title={editingProvince ? 'Edit Province' : 'Add Province'}
        fields={provinceFormFields}
        initialData={editingProvince || {}}
      />
    </div>
  );
}
