"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Info,
  TrendingUp,
  Users,
  DollarSign
} from "lucide-react";

interface TimelineEvent {
  id: string;
  documentType: string;
  expiryDate: string;
  status: 'valid' | 'warning' | 'expired' | 'critical';
  daysUntilExpiry: number;
}

interface TimelineProps {
  documents: any[];
}

export function Timeline({ documents }: TimelineProps) {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  // Generate timeline events from documents
  const timelineEvents: TimelineEvent[] = documents.map(doc => {
    const today = new Date();
    const expiry = new Date(doc.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let status: 'valid' | 'warning' | 'expired' | 'critical' = 'valid';
    if (diffDays <= 0) status = 'expired';
    else if (diffDays <= 30) status = 'critical';
    else if (diffDays <= 90) status = 'warning';

    return {
      id: doc.id,
      documentType: doc.type,
      expiryDate: doc.expiryDate,
      status,
      daysUntilExpiry: diffDays
    };
  });

  // Generate next 12 months
  const months = [];
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push(month);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'expired': return 'bg-red-700';
      case 'warning': return 'bg-yellow-500';
      case 'valid': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDocumentEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      'passport': '🛂',
      'uae_visa': '📋',
      'emirates_id': '🆔',
      'ejari': '🏠',
      'health_insurance': '🏥'
    };
    return emojis[type] || '📄';
  };

  const getDocumentName = (type: string) => {
    const names: Record<string, string> = {
      'passport': 'Passport',
      'uae_visa': 'UAE Visa',
      'emirates_id': 'Emirates ID',
      'ejari': 'Ejari',
      'health_insurance': 'Health Insurance'
    };
    return names[type] || type;
  };

  // Calculate position on timeline (0-100%)
  const getTimelinePosition = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear() + 1, 0, 1);
    
    const totalDays = endOfYear.getTime() - startOfYear.getTime();
    const daysFromStart = expiry.getTime() - startOfYear.getTime();
    
    return Math.max(0, Math.min(100, (daysFromStart / totalDays) * 100));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Document Timeline - Next 12 Months
        </CardTitle>
        <CardDescription>
          Visual overview of all document renewals and deadlines
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
            
            {/* Month Markers */}
            <div className="flex justify-between mb-8">
              {months.map((month, index) => (
                <div key={index} className="text-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                  <div className="text-xs font-medium text-gray-600">
                    {month.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {month.getFullYear()}
                  </div>
                </div>
              ))}
            </div>

            {/* Document Events */}
            <div className="relative">
              {timelineEvents.map((event) => {
                const position = getTimelinePosition(event.expiryDate);
                const isHovered = hoveredEvent === event.id;
                
                return (
                  <TooltipProvider key={event.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`absolute top-4 w-8 h-8 rounded-full ${getStatusColor(event.status)} cursor-pointer transition-all duration-300 ${
                            isHovered ? 'scale-125 shadow-lg' : 'hover:scale-110'
                          }`}
                          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                          onMouseEnter={() => setHoveredEvent(event.id)}
                          onMouseLeave={() => setHoveredEvent(null)}
                        >
                          <div className="flex items-center justify-center h-full text-white text-sm">
                            {getDocumentEmoji(event.documentType)}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <div className="font-semibold">{getDocumentName(event.documentType)}</div>
                          <div className="text-sm text-gray-600">
                            Expires: {new Date(event.expiryDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {event.daysUntilExpiry <= 0 ? 'Expired' : `${event.daysUntilExpiry} days left`}
                          </div>
                          <Badge 
                            variant={event.status === 'critical' || event.status === 'expired' ? 'destructive' : 'secondary'}
                            className="mt-1"
                          >
                            {event.status.toUpperCase()}
                          </Badge>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Valid</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Warning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-700 rounded-full"></div>
              <span className="text-sm text-gray-600">Expired</span>
            </div>
          </div>

          {/* Clustering Analysis */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Renewal Clustering Analysis</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-blue-700">Documents expiring in Q1 2025</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">2</div>
                <div className="text-sm text-green-700">Documents expiring in Q2 2025</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">1</div>
                <div className="text-sm text-yellow-700">Documents expiring in Q3 2025</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
