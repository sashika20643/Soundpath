import { useState } from "react";
import { format } from "date-fns";
import { Eye, Edit, Trash2, ChevronUp, ChevronDown, MapPin, Instagram } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@shared/schema";

interface EventTableProps {
  events: Event[];
  isLoading: boolean;
  onView: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

type SortField = 'title' | 'city' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export function EventTable({ events, isLoading, onView, onEdit, onDelete }: EventTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'createdAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const formatLocation = (event: Event) => {
    const parts = [event.city, event.country, event.continent].filter(Boolean);
    return parts.join(', ');
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Events</h3>
              <Skeleton className="h-4 w-48 mt-1" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="px-6 py-4 border-b">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Events</h3>
          <p className="mt-1 text-sm text-gray-500">
            Showing {events.length} event{events.length === 1 ? '' : 's'}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="px-6 py-3">
                  <Button
                    variant="ghost"
                    className="flex items-center hover:text-gray-700 p-0 h-auto font-medium text-xs text-gray-500 uppercase tracking-wider"
                    onClick={() => handleSort('title')}
                  >
                    Title
                    <SortIcon field="title" />
                  </Button>
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </TableHead>
                <TableHead className="px-6 py-3">
                  <Button
                    variant="ghost"
                    className="flex items-center hover:text-gray-700 p-0 h-auto font-medium text-xs text-gray-500 uppercase tracking-wider"
                    onClick={() => handleSort('city')}
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    Location
                    <SortIcon field="city" />
                  </Button>
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No events found
                  </TableCell>
                </TableRow>
              ) : (
                sortedEvents.map((event) => (
                  <TableRow key={event.id} className="hover:bg-gray-50">
                    <TableCell className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {event.title}
                            </div>
                            {event.instagramLink && (
                              <a 
                                href={event.instagramLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:text-pink-800 text-xs flex items-center mt-1"
                              >
                                <Instagram className="w-3 h-3 mr-1" />
                                Instagram
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="max-w-sm">
                        <div className="text-sm text-gray-900">
                          {truncateText(event.shortDescription, 80)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatLocation(event) || 'No location'}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {event.tags && event.tags.length > 0 ? (
                            event.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No tags</span>
                          )}
                          {event.tags && event.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{event.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(event.createdAt), 'yyyy-MM-dd')}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 mr-2 p-1"
                        onClick={() => onView(event)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 mr-2 p-1"
                        onClick={() => onEdit(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 p-1"
                        onClick={() => onDelete(event)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}