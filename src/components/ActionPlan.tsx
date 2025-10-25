"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from "lucide-react";

interface ActionItem {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium';
  deadline: string;
  daysUntilDeadline: number;
  reason: string;
  steps: string[];
  estimatedCost: string;
  timeNeeded: string;
  isExpanded: boolean;
  completed: boolean;
}

interface ActionPlanProps {
  dependencies: any[];
  documents: any[];
}

export function ActionPlan({ dependencies, documents }: ActionPlanProps) {
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: 'passport-renewal',
      title: 'Renew Passport',
      priority: 'critical',
      deadline: 'Within 30 days',
      daysUntilDeadline: 30,
      reason: 'Your visa expires in 13 months, but your passport expires in 5 months. UAE requires 6 months passport validity AFTER visa expiry.',
      steps: [
        'Book appointment at US Embassy Dubai',
        'Gather photos and documents',
        'Submit application (2-3 weeks processing)',
        'Collect new passport'
      ],
      estimatedCost: 'AED 600',
      timeNeeded: '3-4 weeks',
      isExpanded: true,
      completed: false
    },
    {
      id: 'health-insurance-renewal',
      title: 'Renew Health Insurance',
      priority: 'critical',
      deadline: 'Immediately (EXPIRED)',
      daysUntilDeadline: 0,
      reason: 'Required for visa renewal. Currently expired.',
      steps: [
        'Compare insurance providers',
        'Purchase new policy',
        'Upload proof to GDRFA'
      ],
      estimatedCost: 'AED 600-1200/year',
      timeNeeded: '1-2 days',
      isExpanded: false,
      completed: false
    },
    {
      id: 'ejari-renewal',
      title: 'Renew Ejari',
      priority: 'medium',
      deadline: '90 days (Aug 2025)',
      daysUntilDeadline: 90,
      reason: 'Required 3 months before visa renewal',
      steps: [
        'Contact landlord for renewal',
        'Gather required documents',
        'Visit Dubai Land Department',
        'Pay renewal fees',
        'Collect new Ejari certificate'
      ],
      estimatedCost: 'AED 200-400',
      timeNeeded: '1-2 weeks',
      isExpanded: false,
      completed: false
    }
  ]);

  const toggleExpanded = (id: string) => {
    setActionItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isExpanded: !item.isExpanded }
          : item
      )
    );
  };

  const toggleStepCompleted = (itemId: string, stepIndex: number) => {
    // This would typically update the state to mark individual steps as completed
    console.log(`Toggled step ${stepIndex} for item ${itemId}`);
  };

  const getPriorityStyling = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          badgeClass: 'bg-red-900 text-white',
          cardClass: 'border-red-300 bg-red-50',
          titleClass: 'text-red-900',
          reasonClass: 'text-red-800'
        };
      case 'high':
        return {
          badgeClass: 'bg-yellow-600 text-white',
          cardClass: 'border-yellow-300 bg-yellow-50',
          titleClass: 'text-yellow-900',
          reasonClass: 'text-yellow-800'
        };
      case 'medium':
        return {
          badgeClass: 'bg-blue-600 text-white',
          cardClass: 'border-blue-300 bg-blue-50',
          titleClass: 'text-blue-900',
          reasonClass: 'text-blue-800'
        };
      default:
        return {
          badgeClass: 'bg-gray-600 text-white',
          cardClass: 'border-gray-300 bg-gray-50',
          titleClass: 'text-gray-900',
          reasonClass: 'text-gray-800'
        };
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'medium':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUrgencyText = (daysUntilDeadline: number) => {
    if (daysUntilDeadline <= 0) {
      return 'OVERDUE';
    } else if (daysUntilDeadline <= 7) {
      return 'URGENT';
    } else if (daysUntilDeadline <= 30) {
      return 'HIGH PRIORITY';
    } else {
      return 'UPCOMING';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎯 Your Action Plan
        </h2>
        <p className="text-gray-600">
          Prioritized checklist based on dependency analysis
        </p>
      </div>

      {/* Timeline Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <Calendar className="h-5 w-5 mr-2" />
            Timeline Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-semibold">Critical (0-30 days)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-700 font-semibold">High (30-90 days)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-blue-700 font-semibold">Medium (90+ days)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <div className="space-y-4">
        {actionItems.map((item, index) => {
          const styling = getPriorityStyling(item.priority);
          const urgencyText = getUrgencyText(item.daysUntilDeadline);
          
          return (
            <Card 
              key={item.id} 
              className={`${styling.cardClass} transition-all hover:shadow-lg`}
            >
              <CardHeader 
                className="cursor-pointer"
                onClick={() => toggleExpanded(item.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-600">
                        {index + 1}.
                      </span>
                      {getPriorityIcon(item.priority)}
                    </div>
                    <div>
                      <CardTitle className={`${styling.titleClass} text-lg`}>
                        {item.title}
                      </CardTitle>
                      <CardDescription className={`${styling.reasonClass} text-sm`}>
                        {urgencyText} - {item.deadline}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={styling.badgeClass}>
                      {item.priority.toUpperCase()}
                    </Badge>
                    {item.isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {item.isExpanded && (
                <CardContent className="pt-0">
                  {/* Reason */}
                  <div className="mb-4 p-3 bg-white rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Why this is needed:</h4>
                    <p className={`${styling.reasonClass} text-sm`}>
                      {item.reason}
                    </p>
                  </div>

                  {/* Steps Checklist */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Steps to complete:</h4>
                    <div className="space-y-2">
                      {item.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-center space-x-3">
                          <Checkbox 
                            id={`${item.id}-step-${stepIndex}`}
                            className="data-[state=checked]:bg-blue-600"
                          />
                          <label 
                            htmlFor={`${item.id}-step-${stepIndex}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {step}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cost and Time Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="text-xs text-gray-500">Estimated Cost</div>
                        <div className="font-semibold text-gray-900">{item.estimatedCost}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-xs text-gray-500">Time Needed</div>
                        <div className="font-semibold text-gray-900">{item.timeNeeded}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <Button 
                      className={`${
                        item.priority === 'critical' ? 'bg-red-600 hover:bg-red-700' :
                        item.priority === 'high' ? 'bg-yellow-600 hover:bg-yellow-700' :
                        'bg-blue-600 hover:bg-blue-700'
                      } text-white`}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Start This Task
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-green-900">
            <CheckCircle className="h-5 w-5 mr-2" />
            Action Plan Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {actionItems.filter(item => item.priority === 'critical').length}
              </div>
              <div className="text-sm text-gray-600">Critical Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {actionItems.filter(item => item.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {actionItems.filter(item => item.priority === 'medium').length}
              </div>
              <div className="text-sm text-gray-600">Medium Priority</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
