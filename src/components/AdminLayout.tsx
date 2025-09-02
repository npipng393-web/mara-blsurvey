'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Search,
  Printer,
  Download,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ChevronRight,
  MapPin,
  Building,
  Users,
  Home,
  Tent
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProvinceManager } from '@/components/admin/ProvinceManager';
import { DistrictManager } from '@/components/admin/DistrictManager';
import { LLGManager } from '@/components/admin/LLGManager';
import { WardManager } from '@/components/admin/WardManager';
import { VillageManager } from '@/components/admin/VillageManager';
import { CampManager } from '@/components/admin/CampManager';

type MenuLevel = 'province' | 'district' | 'llg' | 'ward' | 'village' | 'camp';

const menuItems = [
  {
    id: 'province' as MenuLevel,
    label: 'Province',
    icon: MapPin,
    description: 'Manage provincial administrative areas'
  },
  {
    id: 'district' as MenuLevel,
    label: 'District',
    icon: Building,
    description: 'Manage district administrative areas'
  },
  {
    id: 'llg' as MenuLevel,
    label: 'LLG',
    icon: Users,
    description: 'Local Level Government areas'
  },
  {
    id: 'ward' as MenuLevel,
    label: 'Ward',
    icon: Home,
    description: 'Ward level administrative units'
  },
  {
    id: 'village' as MenuLevel,
    label: 'Village',
    icon: Home,
    description: 'Village communities'
  },
  {
    id: 'camp' as MenuLevel,
    label: 'Current Camp',
    icon: Tent,
    description: 'Current resettlement camps'
  }
];

export function AdminLayout() {
  const [activeMenu, setActiveMenu] = useState<MenuLevel>('province');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    console.log('Exporting data for:', activeMenu);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'province':
        return <ProvinceManager />;
      case 'district':
        return <DistrictManager />;
      case 'llg':
        return <LLGManager />;
      case 'ward':
        return <WardManager />;
      case 'village':
        return <VillageManager />;
      case 'camp':
        return <CampManager />;
      default:
        return <ProvinceManager />;
    }
  };

  const activeMenuItem = menuItems.find(item => item.id === activeMenu);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">
            Manam Survey
          </h1>
          <p className="text-sm text-gray-600">
            Administrative Management
          </p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  isActive ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-600' : 'text-gray-700'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto text-blue-600" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-8 border-t">
          <div className="text-xs text-gray-500 mb-2">Quick Stats</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Surveys:</span>
              <span className="font-medium">2</span>
            </div>
            <div className="flex justify-between">
              <span>Active Camps:</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span>Households:</span>
              <span className="font-medium">18</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeMenuItem?.label} Management
                </h2>
                <p className="text-gray-600 mt-1">
                  {activeMenuItem?.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder={`Search ${activeMenuItem?.label.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button onClick={handleSearch} variant="outline" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {/* Print */}
                <Button onClick={handlePrint} variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>

                {/* Export */}
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <Card className="h-full">
            {renderContent()}
          </Card>
        </main>
      </div>
    </div>
  );
}
