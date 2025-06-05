
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from 'lucide-react';
import { FilterOptions } from '../types/birdEye';

interface BirdEyeFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalEntries: number;
  filteredEntries: number;
}

const BirdEyeFilters = ({ filters, onFiltersChange, totalEntries, filteredEntries }: BirdEyeFiltersProps) => {
  const clearFilters = () => {
    onFiltersChange({});
  };

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Search
          </CardTitle>
          <div className="text-sm text-gray-600">
            Showing {filteredEntries} of {totalEntries} entries
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="consignmentNumber">Consignment Number</Label>
            <Input
              id="consignmentNumber"
              value={filters.consignmentNumber || ''}
              onChange={(e) => updateFilter('consignmentNumber', e.target.value)}
              placeholder="Search consignment..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={filters.productName || ''}
              onChange={(e) => updateFilter('productName', e.target.value)}
              placeholder="Search product name..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="movementType">Movement Type</Label>
            <Select
              value={filters.movementType || ''}
              onValueChange={(value) => updateFilter('movementType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All movement types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Warehouse to DA">Warehouse to DA</SelectItem>
                <SelectItem value="DA to DA">DA to DA</SelectItem>
                <SelectItem value="DA to HQ">DA to HQ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status || ''}
              onValueChange={(value) => updateFilter('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="flagType">Flag Type</Label>
            <Select
              value={filters.flagType || ''}
              onValueChange={(value) => updateFilter('flagType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All flag types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">✅ Normal</SelectItem>
                <SelectItem value="exceeds_limit">🚨 Exceeds Limit</SelectItem>
                <SelectItem value="overridden">🟠 Overridden</SelectItem>
                <SelectItem value="incomplete">⚠️ Incomplete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFrom">Date From</Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTo">Date To</Label>
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {Object.keys(filters).filter(key => filters[key as keyof FilterOptions]).length > 0 && (
              <span>
                {Object.keys(filters).filter(key => filters[key as keyof FilterOptions]).length} filter(s) active
              </span>
            )}
          </div>
          <Button 
            variant="outline" 
            onClick={clearFilters}
            disabled={Object.keys(filters).filter(key => filters[key as keyof FilterOptions]).length === 0}
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BirdEyeFilters;
