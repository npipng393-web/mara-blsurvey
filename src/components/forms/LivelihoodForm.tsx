'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Fish, Sprout, Package, Plus, Trash2 } from 'lucide-react';
import { SurveyFormData, LivelihoodIncome } from '@/lib/types';

interface LivelihoodFormProps {
  data: SurveyFormData;
  onUpdate: (data: Partial<SurveyFormData>) => void;
}

export function LivelihoodForm({ data, onUpdate }: LivelihoodFormProps) {
  const [livelihoodIncome, setLivelihoodIncome] = useState<LivelihoodIncome>({
    mainIncomeSource: data.livelihoodIncome?.mainIncomeSource || 'Fishing',
    secondaryIncomeSources: data.livelihoodIncome?.secondaryIncomeSources || [],
    foodSecurityStatus: data.livelihoodIncome?.foodSecurityStatus || 'Mixed',
    assetsOwned: data.livelihoodIncome?.assetsOwned || [],
  });

  const [newSecondarySource, setNewSecondarySource] = useState('');
  const [newAsset, setNewAsset] = useState('');

  useEffect(() => {
    onUpdate({ livelihoodIncome });
  }, [livelihoodIncome, onUpdate]);

  const updateField = (field: keyof LivelihoodIncome, value: any) => {
    setLivelihoodIncome(prev => ({ ...prev, [field]: value }));
  };

  const addSecondarySource = () => {
    if (newSecondarySource.trim()) {
      setLivelihoodIncome(prev => ({
        ...prev,
        secondaryIncomeSources: [...prev.secondaryIncomeSources, newSecondarySource.trim()]
      }));
      setNewSecondarySource('');
    }
  };

  const removeSecondarySource = (index: number) => {
    setLivelihoodIncome(prev => ({
      ...prev,
      secondaryIncomeSources: prev.secondaryIncomeSources.filter((_, i) => i !== index)
    }));
  };

  const addAsset = () => {
    if (newAsset.trim()) {
      setLivelihoodIncome(prev => ({
        ...prev,
        assetsOwned: [...prev.assetsOwned, newAsset.trim()]
      }));
      setNewAsset('');
    }
  };

  const removeAsset = (index: number) => {
    setLivelihoodIncome(prev => ({
      ...prev,
      assetsOwned: prev.assetsOwned.filter((_, i) => i !== index)
    }));
  };

  const toggleAsset = (asset: string, checked: boolean) => {
    setLivelihoodIncome(prev => ({
      ...prev,
      assetsOwned: checked
        ? [...prev.assetsOwned, asset]
        : prev.assetsOwned.filter(a => a !== asset)
    }));
  };

  const commonAssets = [
    'Canoe/Boat',
    'Fishing nets',
    'Fishing lines and hooks',
    'Garden tools (spades, hoes)',
    'Hunting equipment',
    'Livestock (pigs, chickens)',
    'Cooking utensils',
    'Solar panel/battery',
    'Radio/Communication device',
    'Sewing machine',
    'Bicycle',
    'Chainsaw',
    'Generator',
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Primary Income Source</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              What is your household's main source of income?
            </label>
            <Select
              value={livelihoodIncome.mainIncomeSource}
              onValueChange={(value: any) => updateField('mainIncomeSource', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fishing">Fishing</SelectItem>
                <SelectItem value="Farming">Farming/Agriculture</SelectItem>
                <SelectItem value="Remittances">Remittances from family</SelectItem>
                <SelectItem value="Government aid">Government assistance</SelectItem>
                <SelectItem value="Informal business">Small business/Trade</SelectItem>
                <SelectItem value="Wage labor">Wage employment</SelectItem>
                <SelectItem value="Hunting and gathering">Hunting and gathering</SelectItem>
                <SelectItem value="Handicrafts">Handicrafts/Artisan work</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {livelihoodIncome.mainIncomeSource === 'Other' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Please specify other income source
              </label>
              <Input placeholder="Describe the main income source" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Secondary Income Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              What other ways does your household earn income?
            </label>

            <div className="space-y-2">
              {livelihoodIncome.secondaryIncomeSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{source}</span>
                  <Button
                    onClick={() => removeSecondarySource(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {livelihoodIncome.secondaryIncomeSources.length === 0 && (
                <p className="text-sm text-gray-500 italic py-2">No secondary income sources listed</p>
              )}
            </div>

            <div className="flex space-x-2 mt-3">
              <Input
                value={newSecondarySource}
                onChange={(e) => setNewSecondarySource(e.target.value)}
                placeholder="e.g., Part-time fishing, Selling vegetables, Handicrafts"
                onKeyPress={(e) => e.key === 'Enter' && addSecondarySource()}
              />
              <Button
                onClick={addSecondarySource}
                disabled={!newSecondarySource.trim()}
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
          <CardTitle className="flex items-center space-x-2">
            <Sprout className="h-5 w-5" />
            <span>Food Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              How would you describe your household's food security?
            </label>
            <Select
              value={livelihoodIncome.foodSecurityStatus}
              onValueChange={(value: any) => updateField('foodSecurityStatus', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Self-sufficient">Self-sufficient (grow/catch most food)</SelectItem>
                <SelectItem value="Dependent on aid">Dependent on food aid/assistance</SelectItem>
                <SelectItem value="Mixed">Mixed (some self-production, some assistance)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`p-4 rounded-lg ${
            livelihoodIncome.foodSecurityStatus === 'Self-sufficient' ? 'bg-green-50' :
            livelihoodIncome.foodSecurityStatus === 'Dependent on aid' ? 'bg-red-50' : 'bg-yellow-50'
          }`}>
            <h4 className={`font-medium mb-2 ${
              livelihoodIncome.foodSecurityStatus === 'Self-sufficient' ? 'text-green-900' :
              livelihoodIncome.foodSecurityStatus === 'Dependent on aid' ? 'text-red-900' : 'text-yellow-900'
            }`}>
              Food Security Details
            </h4>
            <Textarea
              placeholder="Describe your food sources, any food shortages, seasonal variations, etc."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Household Assets</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">
              What assets does your household own? (Select all that apply)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commonAssets.map((asset) => (
                <div key={asset} className="flex items-center space-x-2">
                  <Checkbox
                    id={asset}
                    checked={livelihoodIncome.assetsOwned.includes(asset)}
                    onCheckedChange={(checked) => toggleAsset(asset, !!checked)}
                  />
                  <label htmlFor={asset} className="text-sm">{asset}</label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Other Assets
            </label>
            <div className="space-y-2">
              {livelihoodIncome.assetsOwned
                .filter(asset => !commonAssets.includes(asset))
                .map((asset, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{asset}</span>
                  <Button
                    onClick={() => removeAsset(livelihoodIncome.assetsOwned.indexOf(asset))}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2 mt-3">
              <Input
                value={newAsset}
                onChange={(e) => setNewAsset(e.target.value)}
                placeholder="e.g., Outboard motor, Water tank, etc."
                onKeyPress={(e) => e.key === 'Enter' && addAsset()}
              />
              <Button
                onClick={addAsset}
                disabled={!newAsset.trim()}
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
          <CardTitle className="flex items-center space-x-2">
            <Fish className="h-5 w-5" />
            <span>Livelihood Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {livelihoodIncome.mainIncomeSource === 'Fishing' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Fishing Activities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Types of fish caught</label>
                  <Textarea placeholder="List main fish species..." rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fishing methods used</label>
                  <Textarea placeholder="Nets, lines, spearing, etc." rows={2} />
                </div>
              </div>
            </div>
          )}

          {livelihoodIncome.mainIncomeSource === 'Farming' && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Farming Activities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Crops grown</label>
                  <Textarea placeholder="List main crops..." rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Land size cultivated</label>
                  <Input placeholder="Approximate acres/hectares" />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Economic Challenges
            </label>
            <Textarea
              placeholder="What are the main challenges affecting your household's income and livelihood?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Income Improvements Needed
            </label>
            <Textarea
              placeholder="What support or resources would help improve your household's income?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Livelihood & Income Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Main Income:</strong> {livelihoodIncome.mainIncomeSource}</p>
                <p><strong>Secondary Sources:</strong> {livelihoodIncome.secondaryIncomeSources.length} listed</p>
                <p><strong>Food Security:</strong> {livelihoodIncome.foodSecurityStatus}</p>
              </div>
              <div>
                <p><strong>Assets Owned:</strong> {livelihoodIncome.assetsOwned.length} items</p>
                <p><strong>Key Assets:</strong> {
                  livelihoodIncome.assetsOwned.slice(0, 3).join(', ') +
                  (livelihoodIncome.assetsOwned.length > 3 ? '...' : '')
                }</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
