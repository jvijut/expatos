"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, ArrowRight, Brain, AlertCircle } from "lucide-react";

interface DocumentDependency {
  id: string;
  documentId: string;
  dependentId: string;
  dependencyType: string;
  description: string;
  isRequired: boolean;
  status: "ok" | "warning" | "critical";
}

interface Document {
  id: string;
  title: string;
  type: string;
  expiryDate?: string;
  status: "ACTIVE" | "EXPIRED" | "RENEWED";
}

interface DependencyMapProps {
  documents: Document[];
  dependencies: DocumentDependency[];
}

export function DependencyMap({ documents, dependencies }: DependencyMapProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  // Mock data for demonstration
  const mockDocuments: Document[] = [
    {
      id: "1",
      title: "US Passport",
      type: "PASSPORT",
      expiryDate: "2025-05-15",
      status: "ACTIVE"
    },
    {
      id: "2",
      title: "UAE Employment Visa",
      type: "VISA", 
      expiryDate: "2024-12-20",
      status: "ACTIVE"
    },
    {
      id: "3",
      title: "Emirates ID",
      type: "EMIRATES_ID",
      expiryDate: "2025-03-10", 
      status: "ACTIVE"
    },
    {
      id: "4",
      title: "Ejari Contract",
      type: "EJARI",
      expiryDate: "2025-01-15",
      status: "ACTIVE"
    },
    {
      id: "5",
      title: "Health Insurance",
      type: "HEALTH_INSURANCE",
      expiryDate: "2025-06-30",
      status: "ACTIVE"
    }
  ];

  const mockDependencies: DocumentDependency[] = [
    {
      id: "dep1",
      documentId: "2", // UAE Visa
      dependentId: "1", // US Passport
      dependencyType: "REQUIRES_VALID_PASSPORT",
      description: "UAE visa renewal requires passport with 6+ months validity",
      isRequired: true,
      status: "critical"
    },
    {
      id: "dep2", 
      documentId: "2", // UAE Visa
      dependentId: "4", // Ejari
      dependencyType: "REQUIRES_VALID_EJARI",
      description: "Visa renewal requires valid Ejari contract",
      isRequired: true,
      status: "warning"
    },
    {
      id: "dep3",
      documentId: "2", // UAE Visa  
      dependentId: "5", // Health Insurance
      dependencyType: "REQUIRES_HEALTH_INSURANCE",
      description: "Visa renewal requires active health insurance",
      isRequired: true,
      status: "ok"
    },
    {
      id: "dep4",
      documentId: "3", // Emirates ID
      dependentId: "2", // UAE Visa
      dependencyType: "REQUIRES_VALID_VISA", 
      description: "Emirates ID renewal requires valid visa",
      isRequired: true,
      status: "warning"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const criticalDependencies = mockDependencies.filter(dep => dep.status === "critical");
  const warningDependencies = mockDependencies.filter(dep => dep.status === "warning");

  return (
    <div className="space-y-6">
      {/* AI Dependency Analysis Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <Brain className="h-5 w-5 mr-2" />
            AI Dependency Analysis
          </CardTitle>
          <CardDescription className="text-blue-700">
            Our AI has analyzed your documents and found critical dependencies that could affect your renewals.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Critical Alerts */}
      {criticalDependencies.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-900">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Critical Dependencies
            </CardTitle>
            <CardDescription className="text-red-700">
              These dependencies require immediate attention to avoid renewal failures.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {criticalDependencies.map((dep) => {
              const document = mockDocuments.find(d => d.id === dep.documentId);
              const dependent = mockDocuments.find(d => d.id === dep.dependentId);
              const daysLeft = dependent?.expiryDate ? getDaysUntilExpiry(dependent.expiryDate) : null;
              
              return (
                <div key={dep.id} className="p-4 bg-white rounded-lg border border-red-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(dep.status)}
                        <span className="font-medium text-red-900">
                          {document?.title} renewal blocked
                        </span>
                        <Badge variant="destructive">CRITICAL</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-red-700 mb-2">
                        <span className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Requires: {dependent?.title}
                        </span>
                        {daysLeft !== null && (
                          <span className="font-medium">
                            {daysLeft <= 0 ? 'EXPIRED' : `${daysLeft} days left`}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-red-600 mb-3">{dep.description}</p>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="destructive">
                          Renew {dependent?.title}
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Warning Dependencies */}
      {warningDependencies.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-900">
              <Clock className="h-5 w-5 mr-2" />
              Warning Dependencies
            </CardTitle>
            <CardDescription className="text-orange-700">
              These dependencies need attention soon to ensure smooth renewals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {warningDependencies.map((dep) => {
              const document = mockDocuments.find(d => d.id === dep.documentId);
              const dependent = mockDocuments.find(d => d.id === dep.dependentId);
              const daysLeft = dependent?.expiryDate ? getDaysUntilExpiry(dependent.expiryDate) : null;
              
              return (
                <div key={dep.id} className="p-4 bg-white rounded-lg border border-orange-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(dep.status)}
                        <span className="font-medium text-orange-900">
                          {document?.title} renewal concern
                        </span>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          WARNING
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-orange-700 mb-2">
                        <span className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Requires: {dependent?.title}
                        </span>
                        {daysLeft !== null && (
                          <span className="font-medium">
                            {daysLeft <= 0 ? 'EXPIRED' : `${daysLeft} days left`}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-orange-600 mb-3">{dep.description}</p>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                          Plan Renewal
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Document Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Document Overview</CardTitle>
          <CardDescription>
            All your documents and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockDocuments.map((doc) => {
              const daysLeft = doc.expiryDate ? getDaysUntilExpiry(doc.expiryDate) : null;
              const isExpiringSoon = daysLeft !== null && daysLeft <= 90;
              const isExpired = daysLeft !== null && daysLeft <= 0;
              
              return (
                <div 
                  key={doc.id} 
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    isExpired ? 'border-red-200 bg-red-50' : 
                    isExpiringSoon ? 'border-orange-200 bg-orange-50' : 
                    'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDocument(doc.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{doc.title}</h4>
                    <Badge className={getStatusColor(
                      isExpired ? 'critical' : isExpiringSoon ? 'warning' : 'ok'
                    )}>
                      {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    Type: {doc.type.replace('_', ' ')}
                  </div>
                  
                  {doc.expiryDate && (
                    <div className="text-sm text-gray-500">
                      Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                      {daysLeft !== null && (
                        <span className="ml-2 font-medium">
                          ({daysLeft <= 0 ? 'Expired' : `${daysLeft} days left`})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


