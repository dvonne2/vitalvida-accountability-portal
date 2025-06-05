
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Plus, Filter, CheckCircle, AlertTriangle, Shield, Clock } from 'lucide-react';
import BirdEyeForm from './BirdEyeForm';
import BirdEyeTable from './BirdEyeTable';
import BirdEyeFilters from './BirdEyeFilters';
import FlagCardModal from './FlagCardModal';
import { BirdEyeEntry, FilterOptions } from '../types/birdEye';

interface BirdEyePanelProps {
  userRole: string;
}

const BirdEyePanel = ({ userRole }: BirdEyePanelProps) => {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [entries, setEntries] = useState<BirdEyeEntry[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedFlag, setSelectedFlag] = useState<'normal' | 'exceeds_limit' | 'overridden' | 'incomplete' | null>(null);

  const isLogisticsManager = userRole === 'logistics_manager';

  const handleAddEntry = (entry: BirdEyeEntry) => {
    setEntries(prev => [entry, ...prev]); // Add to beginning for newest first
    setShowNewEntry(false);
  };

  const filteredEntries = entries.filter(entry => {
    if (filters.movementType && entry.movementType !== filters.movementType) return false;
    if (filters.productName && !entry.productName.toLowerCase().includes(filters.productName.toLowerCase())) return false;
    if (filters.consignmentNumber && !entry.consignmentNumber.toLowerCase().includes(filters.consignmentNumber.toLowerCase())) return false;
    if (filters.status && entry.status !== filters.status) return false;
    if (filters.flagType && entry.flag?.type !== filters.flagType) return false;
    if (filters.dateFrom && entry.movementDate < filters.dateFrom) return false;
    if (filters.dateTo && entry.movementDate > filters.dateTo) return false;
    return true;
  });

  const getFlagCounts = () => {
    return {
      normal: entries.filter(e => e.flag?.type === 'normal').length,
      exceeds_limit: entries.filter(e => e.flag?.type === 'exceeds_limit').length,
      overridden: entries.filter(e => e.flag?.type === 'overridden').length,
      incomplete: entries.filter(e => e.flag?.type === 'incomplete').length
    };
  };

  const handleFlagCardClick = (flagType: 'normal' | 'exceeds_limit' | 'overridden' | 'incomplete') => {
    setSelectedFlag(flagType);
  };

  const getSelectedFlagEntries = () => {
    if (!selectedFlag) return [];
    return entries.filter(e => e.flag?.type === selectedFlag);
  };

  const flagCounts = getFlagCounts();

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
                      All required fields must be completed for compliance tracking
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
                <Card 
                  className="border-green-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleFlagCardClick('normal')}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">{flagCounts.normal}</div>
                    <div className="text-sm text-gray-600">Normal</div>
                  </CardContent>
                </Card>

                <Card 
                  className="border-red-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleFlagCardClick('exceeds_limit')}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-red-600">{flagCounts.exceeds_limit}</div>
                    <div className="text-sm text-gray-600">Exceeds Limit</div>
                  </CardContent>
                </Card>

                <Card 
                  className="border-orange-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleFlagCardClick('overridden')}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Shield className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{flagCounts.overridden}</div>
                    <div className="text-sm text-gray-600">Overridden</div>
                  </CardContent>
                </Card>

                <Card 
                  className="border-yellow-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleFlagCardClick('incomplete')}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">{flagCounts.incomplete}</div>
                    <div className="text-sm text-gray-600">Incomplete</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <FlagCardModal
        isOpen={selectedFlag !== null}
        onClose={() => setSelectedFlag(null)}
        flagType={selectedFlag || 'normal'}
        entries={getSelectedFlagEntries()}
      />
    </div>
  );
};

export default BirdEyePanel;
