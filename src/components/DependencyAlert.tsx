"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CriticalAlert } from "@/lib/ai/analyzeDependencies";
import { 
  AlertTriangle, 
  Zap, 
  Info, 
  Clock, 
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface DependencyAlertProps {
  alert: CriticalAlert;
}

export function DependencyAlert({ alert }: DependencyAlertProps) {
  // Get icon based on severity
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <Zap className="h-6 w-6 text-yellow-600" />;
      case 'info':
        return <Info className="h-6 w-6 text-blue-600" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-600" />;
    }
  };

  // Get styling based on severity
  const getAlertStyling = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          containerClass: "border-red-500 bg-red-50 shadow-red-200",
          titleClass: "text-red-900",
          descriptionClass: "text-red-800",
          actionClass: "text-red-700",
          buttonClass: "bg-red-600 hover:bg-red-700 text-white",
          pulseClass: "animate-pulse border-red-500"
        };
      case 'warning':
        return {
          containerClass: "border-yellow-500 bg-yellow-50 shadow-yellow-200",
          titleClass: "text-yellow-900",
          descriptionClass: "text-yellow-800",
          actionClass: "text-yellow-700",
          buttonClass: "bg-yellow-600 hover:bg-yellow-700 text-white",
          pulseClass: ""
        };
      case 'info':
        return {
          containerClass: "border-blue-500 bg-blue-50 shadow-blue-200",
          titleClass: "text-blue-900",
          descriptionClass: "text-blue-800",
          actionClass: "text-blue-700",
          buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
          pulseClass: ""
        };
      default:
        return {
          containerClass: "border-gray-500 bg-gray-50 shadow-gray-200",
          titleClass: "text-gray-900",
          descriptionClass: "text-gray-800",
          actionClass: "text-gray-700",
          buttonClass: "bg-gray-600 hover:bg-gray-700 text-white",
          pulseClass: ""
        };
    }
  };

  const styling = getAlertStyling(alert.severity);
  const isCritical = alert.severity === 'critical';

  // Format countdown text
  const getCountdownText = () => {
    if (alert.daysUntilDeadline <= 0) {
      return "🚨 OVERDUE - ACTION REQUIRED NOW";
    } else if (alert.daysUntilDeadline <= 7) {
      return `🚨 ${alert.daysUntilDeadline} DAYS LEFT - URGENT!`;
    } else if (alert.daysUntilDeadline <= 30) {
      return `⚠️ ${alert.daysUntilDeadline} days until deadline`;
    } else {
      return `⏰ ${alert.daysUntilDeadline} days until deadline`;
    }
  };

  // Get countdown styling
  const getCountdownStyling = () => {
    if (alert.daysUntilDeadline <= 0) {
      return "text-red-900 font-bold text-lg bg-red-200 px-3 py-1 rounded-lg";
    } else if (alert.daysUntilDeadline <= 7) {
      return "text-red-800 font-bold text-lg bg-red-100 px-3 py-1 rounded-lg";
    } else if (alert.daysUntilDeadline <= 30) {
      return "text-orange-800 font-semibold text-lg bg-orange-100 px-3 py-1 rounded-lg";
    } else {
      return "text-gray-800 font-medium text-lg bg-gray-100 px-3 py-1 rounded-lg";
    }
  };

  return (
    <Card className={`${styling.containerClass} ${isCritical ? styling.pulseClass : ''} shadow-lg border-2 transition-all hover:shadow-xl`}>
      <CardContent className="p-6">
        {/* Header with Icon and Severity Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getAlertIcon(alert.severity)}
            <div>
              <h3 className={`text-xl font-bold ${styling.titleClass}`}>
                {alert.title}
              </h3>
              <Badge 
                variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                className={`mt-1 ${
                  alert.severity === 'critical' ? 'bg-red-900 text-white' :
                  alert.severity === 'warning' ? 'bg-yellow-600 text-white' :
                  'bg-blue-600 text-white'
                }`}
              >
                {alert.severity.toUpperCase()}
              </Badge>
            </div>
          </div>
          
          {/* Countdown Timer */}
          <div className="text-right">
            <div className={`${getCountdownStyling()} inline-block`}>
              {getCountdownText()}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Deadline: {alert.deadline}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={`mb-4 ${styling.descriptionClass}`}>
          <p className="text-base leading-relaxed">
            {alert.description}
          </p>
        </div>

        {/* Affected Documents */}
        {alert.affectedDocuments.length > 0 && (
          <div className="mb-4">
            <h4 className={`font-semibold ${styling.titleClass} mb-2`}>
              Affected Documents:
            </h4>
            <div className="flex flex-wrap gap-2">
              {alert.affectedDocuments.map((doc, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className={`${
                    alert.severity === 'critical' ? 'border-red-300 text-red-700' :
                    alert.severity === 'warning' ? 'border-yellow-300 text-yellow-700' :
                    'border-blue-300 text-blue-700'
                  }`}
                >
                  {doc.replace('_', ' ').toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Required Section */}
        <div className={`mb-6 p-4 rounded-lg ${
          alert.severity === 'critical' ? 'bg-red-100 border border-red-200' :
          alert.severity === 'warning' ? 'bg-yellow-100 border border-yellow-200' :
          'bg-blue-100 border border-blue-200'
        }`}>
          <h4 className={`font-bold ${styling.actionClass} mb-2 flex items-center`}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Action Required:
          </h4>
          <p className={`${styling.actionClass} font-medium`}>
            {alert.actionRequired}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <Button 
            className={`${styling.buttonClass} px-6 py-2 font-semibold`}
            size="lg"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Action Plan
          </Button>
          
          {isCritical && (
            <div className="flex items-center text-red-600 font-semibold">
              <Clock className="h-4 w-4 mr-1" />
              Immediate Action Required
            </div>
          )}
        </div>

        {/* Critical Alert Extra Warning */}
        {isCritical && (
          <div className="mt-4 p-3 bg-red-200 border border-red-300 rounded-lg">
            <div className="flex items-center text-red-900 font-bold">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>This issue will cause visa renewal failure if not resolved immediately!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
