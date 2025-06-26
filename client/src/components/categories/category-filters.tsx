import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface CategoryFiltersProps {
  onFiltersChange: (filters: { type?: string; search?: string }) => void;
  filters: { type?: string; search?: string };
}

export function CategoryFilters({ onFiltersChange, filters }: CategoryFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleTypeChange = (value: string) => {
    onFiltersChange({ ...filters, type: value === "all" ? undefined : value });
  };

  const handleClearFilters = () => {
    setLocalSearch("");
    onFiltersChange({});
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Categories
            </Label>
            <div className="relative">
              <Input
                id="search"
                type="text"
                placeholder="Search by name..."
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
          
          <div className="sm:w-48">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </Label>
            <Select value={filters.type || "all"} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="genre">Genres</SelectItem>
                <SelectItem value="setting">Settings</SelectItem>
                <SelectItem value="eventType">Event Types</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="sm:w-32 flex items-end">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
