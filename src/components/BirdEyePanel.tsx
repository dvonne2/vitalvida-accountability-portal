
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Plus, Filter } from 'lucide-react';
import BirdEyeForm from './BirdEyeForm';
import BirdEyeTable from './BirdEyeTable';
import BirdEyeFilters from './BirdEyeFilters';
import { BirdEyeEntry, FilterOptions } from '../types/birdEye';

interface BirdEyePanelProps {
  userRole: string;
}

const BirdEyePanel = ({ userRole }: BirdEyePanelProps) => {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [entries, setEntries] = useState<BirdEyeEntry[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});

  const isLogisticsManager = userRole === 'logistics_manager';

  const handleAddEntry = (entry: BirdEyeEntry) => {
    setEntries(prev => [entry, ...prev]); // Add to beginning for newest first
    setShowNewEntry(false);
  };

  const filteredEntries = entries.filter(entry => {
    if (filters.movementType && entry.movementType !== filters.movementType) return false;
    if (filters.productName && !entry.productName.toLowerCase().includes(filters.productName.toLowerCase())) return false;
    if (filters.status && entry.status !== filters.status) return false;
    if (filters.flagType && entry.flag?.type !== filters.flagType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Bird Eye Panel - Stock Movement Tracking
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Track logistics movements: Warehouse ↔ DA ↔ HQ
              </p>
            </div>
            {isLogisticsManager && (
              <Button 
                onClick={() => setShowNewEntry(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Movement Entry
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="table">Movement Records</TabsTrigger>
              <TabsTrigger value="filters">Filters & Search</TabsTrigger>
              <TabsTrigger value="summary">Flag Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-4">
              {showNewEntry && isLogisticsManager && (
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700">New Movement Entry</CardTitle>
                    <p className="text-sm text-gray-600">
                      All 18 fields are required for compliance tracking
                    </p>
                  </CardHeader>
                  <CardContent>
                    <BirdEyeForm 
                      onSubmit={handleAddEntry}
                      onCancel={() => setShowNewEntry(false)}
                    />
                  </CardContent>
                </Card>
              )}
              
              <BirdEyeTable entries={filteredEntries} />
            </TabsContent>

            <TabsContent value="filters">
              <BirdEyeFilters 
                filters={filters}
                onFiltersChange={setFilters}
                totalEntries={entries.length}
                filteredEntries={filteredEntries.length}
              />
            </TabsContent>

            <TabsContent value="summary">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Normal', 'Exceeds Limit', 'Overridden', 'Incomplete'].map((flagType) => {
                  const count = entries.filter(e => e.flag?.display === flagType).length;
                  const color = flagType === 'Normal' ? 'green' : 
                               flagType === 'Exceeds Limit' ? 'red' :
                               flagType === 'Overridden' ? 'orange' : 'yellow';
                  
                  return (
                    <Card key={flagType} className={`border-${color}-200`}>
                      <CardContent className="p-4 text-center">
                        <div className={`text-2xl font-bold text-${color}-600`}>{count}</div>
                        <div className="text-sm text-gray-600">{flagType}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BirdEyePanel;
