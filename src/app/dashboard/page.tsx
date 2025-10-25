"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Upload, 
  Search, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Users, 
  Globe,
  CheckCircle,
  Clock,
  Plus,
  TrendingDown,
  TrendingUp,
  Activity,
  XCircle
} from "lucide-react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { DocumentSearch } from "@/components/DocumentSearch";
import { DependencyAlert } from "@/components/DependencyAlert";
import { DependencyGraph } from "@/components/DependencyGraph";
import { ActionPlan } from "@/components/ActionPlan";
import { Timeline } from "@/components/Timeline";
import { DemoBanner } from "@/components/DemoBanner";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ImpressiveStats, Testimonials } from "@/components/ImpressiveStats";
import { CallToActions } from "@/components/CallToActions";
import { mockDocuments } from "@/lib/mockData";
import { analyzeDependencies } from "@/lib/ai/analyzeDependencies";

// Helper function to get document emoji
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

// Helper function to get document type display name
const getDocumentTypeName = (type: string) => {
  const names: Record<string, string> = {
    'passport': 'Passport',
    'uae_visa': 'UAE Visa',
    'emirates_id': 'Emirates ID',
    'ejari': 'Ejari',
    'health_insurance': 'Health Insurance'
  };
  return names[type] || type;
};

// Helper function to calculate days until expiry
const getDaysUntilExpiry = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to determine document status
const getDocumentStatus = (doc: any) => {
  const daysLeft = getDaysUntilExpiry(doc.expiryDate);
  
  if (daysLeft <= 0) {
    return 'expired';
  } else if (daysLeft <= 90) {
    return 'warning';
  } else if (doc.status === 'expired') {
    return 'expired';
  } else if (doc.status === 'warning') {
    return 'warning';
  } else {
    return 'valid';
  }
};

// Helper function to get status badge variant and styling
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'valid':
      return {
        variant: 'secondary' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
        text: 'Valid'
      };
    case 'warning':
      return {
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        text: 'Warning'
      };
    case 'expired':
      return {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200',
        text: 'Expired'
      };
    case 'critical':
      return {
        variant: 'destructive' as const,
        className: 'bg-red-900 text-white border-red-900 animate-pulse',
        text: 'Critical'
      };
    default:
      return {
        variant: 'secondary' as const,
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        text: 'Unknown'
      };
  }
};

// Health Score Component
function HealthScore({ score }: { score: number }) {
  const getHealthColor = (score: number) => {
    if (score <= 40) return 'text-red-600';
    if (score <= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getHealthLabel = (score: number) => {
    if (score <= 40) return 'Critical';
    if (score <= 70) return 'Needs Attention';
    return 'All Good';
  };

  const getHealthIcon = (score: number) => {
    if (score <= 40) return <TrendingDown className="h-5 w-5 text-red-600" />;
    if (score <= 70) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <TrendingUp className="h-5 w-5 text-green-600" />;
  };

  return (
    <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-gray-900">
          <Activity className="h-5 w-5 mr-2" />
          Document Health Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={getHealthColor(score)}
                strokeWidth="3"
                strokeDasharray={`${score}, 100`}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold ${getHealthColor(score)}`}>
                {score}%
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              {getHealthIcon(score)}
              <span className={`font-semibold ${getHealthColor(score)}`}>
                {getHealthLabel(score)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {score <= 40 ? 'Critical issues require immediate attention' :
               score <= 70 ? 'Some documents need renewal soon' :
               'All documents are up to date'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    const performAnalysis = async () => {
      setIsLoading(true);
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = analyzeDependencies(mockDocuments);
      setAnalysis(result);
      setIsLoading(false);
    };

    performAnalysis();
  }, []);

  // Calculate statistics
  const totalDocuments = mockDocuments.length;
  const validDocuments = mockDocuments.filter(doc => getDocumentStatus(doc) === 'valid').length;
  const expiringSoon = mockDocuments.filter(doc => {
    const status = getDocumentStatus(doc);
    return status === 'warning';
  }).length;
  const criticalIssues = mockDocuments.filter(doc => {
    const status = getDocumentStatus(doc);
    return status === 'expired' || status === 'critical';
  }).length;

  const criticalAlerts = analysis?.criticalAlerts?.filter((alert: any) => 
    alert.severity === 'critical' || alert.severity === 'warning'
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Demo Mode Banner */}
      <DemoBanner />

      {/* Top Navigation Bar */}
      <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* ExpatOS Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ExpatOS</h1>
                <p className="text-sm text-gray-500">AI Memory & Assistant</p>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">John Smith</p>
                <p className="text-xs text-gray-500">Global Citizen</p>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  JS
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, John! 👋
                  </h2>
                  <p className="text-gray-600">
                    Here's your expat document overview for today
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {/* DEMO POINT: "Click the green 'Demo: Upload New Passport' button - this is the AI magic moment" */}
                  <DocumentUpload 
                    onUploadComplete={(doc) => {
                      // Add new document to mock data and re-run analysis
                      console.log('New document uploaded:', doc);
                    }}
                    onDemoUpload={() => {
                      // DEMO POINT: "Watch the dashboard transform: Health score jumps to 95%, alerts disappear, dependency graph turns green"
                      console.log('Demo upload completed');
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Impressive Stats */}
            {/* DEMO POINT: Show credibility with impressive numbers */}
            <div className="mb-8 animate-fade-in">
              <ImpressiveStats />
            </div>

            {/* Health Score */}
            {/* DEMO POINT: "Look at John's health score: 45% - CRITICAL. This is the reality most expats face" */}
            <div className="mb-8 animate-fade-in">
              <HealthScore score={analysis?.healthScore || 45} />
            </div>

            {/* Stats Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-fade-in">
              {/* Total Documents */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalDocuments}</div>
                  <p className="text-xs text-muted-foreground">
                    All document types
                  </p>
                </CardContent>
              </Card>

              {/* Valid Documents */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valid Documents</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{validDocuments}</div>
                  <p className="text-xs text-muted-foreground">
                    Up to date
                  </p>
                </CardContent>
              </Card>

              {/* Expiring Soon */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{expiringSoon}</div>
                  <p className="text-xs text-muted-foreground">
                    &lt;90 days
                  </p>
                </CardContent>
              </Card>

              {/* Critical Issues */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{criticalIssues}</div>
                  <p className="text-xs text-muted-foreground">
                    Requires attention
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CRITICAL ALERTS SECTION */}
            {/* DEMO POINT: "The red banner shows URGENT issues. Read the scary alert message about passport" */}
            {criticalAlerts.length > 0 && (
              <div className="mb-8 animate-fade-in">
                {/* Critical Banner */}
                {/* DEMO POINT: "This pulsing red banner is impossible to miss - exactly what expats need" */}
                <div className="bg-red-600 text-white p-4 rounded-lg mb-6 shadow-lg animate-pulse">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-6 w-6" />
                    <div>
                      <h3 className="text-xl font-bold">
                        ⚠️ URGENT: You have {criticalAlerts.length} critical issues
                      </h3>
                      <p className="text-red-100">
                        These issues will cause visa renewal failure if not resolved immediately
                      </p>
                    </div>
                  </div>
                </div>

                {/* Alert Components */}
                <div className="space-y-4">
                  {criticalAlerts.map((alert: any, index: number) => (
                    <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 200}ms` }}>
                      <DependencyAlert alert={alert} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline Section */}
            {/* DEMO POINT: "This shows the clustering of renewals - 3 documents expiring in Q1 2025" */}
            <div className="mb-8 animate-fade-in">
              <Timeline documents={mockDocuments} />
            </div>

            {/* Dependency Graph Section */}
            {/* DEMO POINT: "This is where judges will understand the power of our AI. The visual 'aha' moment" */}
            <div className="mb-8 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Document Dependency Status
                </h3>
                <p className="text-gray-600">
                  How your documents are connected
                </p>
              </div>
              {/* DEMO POINT: "Look at the UAE Visa in the center - it's the master document. See the RED line to passport? That's FAILING" */}
              <DependencyGraph 
                dependencies={analysis?.dependencies || []} 
                documents={mockDocuments} 
              />
            </div>

            {/* Action Plan Section */}
            {/* DEMO POINT: "The AI has created an ordered checklist. Walk through Priority 1: Renew Passport - $600, 3-4 weeks" */}
            <div className="mb-8 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Your Renewal Checklist
                </h3>
                <p className="text-gray-600">
                  Complete these tasks in order
                </p>
              </div>
              {/* DEMO POINT: "This transforms panic into a clear, actionable plan with specific deadlines and costs" */}
              <ActionPlan 
                dependencies={analysis?.dependencies || []} 
                documents={mockDocuments} 
              />
            </div>

            {/* Call to Actions */}
            <div className="mb-8 animate-fade-in">
              <CallToActions 
                onStartManaging={() => console.log('Start managing clicked')}
                onInviteFamily={() => console.log('Invite family clicked')}
                onExportReport={() => console.log('Export report clicked')}
              />
            </div>

            {/* Testimonials */}
            {/* DEMO POINT: "Real stories from users who avoided costly mistakes. Sarah saved $3,000, Ahmed saved $1,800" */}
            <div className="mb-8 animate-fade-in">
              <Testimonials />
            </div>

            {/* Documents Table */}
            <Card className="shadow-lg animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Document Overview
                </CardTitle>
                <CardDescription>
                  All your important documents and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Document</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Number</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Expiry Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockDocuments.map((doc) => {
                        const status = getDocumentStatus(doc);
                        const daysLeft = getDaysUntilExpiry(doc.expiryDate);
                        const statusBadge = getStatusBadge(status);
                        
                        return (
                          <tr key={doc.id} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{getDocumentEmoji(doc.type)}</span>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {getDocumentTypeName(doc.type)}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {doc.issuingAuthority}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-600">
                                {getDocumentTypeName(doc.type)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-mono text-sm text-gray-900">
                                {doc.number}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <div className="text-sm text-gray-900">
                                  {new Date(doc.expiryDate).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {daysLeft <= 0 ? 'Expired' : `${daysLeft} days left`}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge 
                                variant={statusBadge.variant}
                                className={statusBadge.className}
                              >
                                {statusBadge.text}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

/**
 * DEMO CLOSING STATEMENT:
 * 
 * "This is what every expat needs. We're preventing visa rejections, 
 * saving thousands in fees, and giving peace of mind to global citizens worldwide.
 * 
 * ExpatOS: Where AI meets expat life."
 */
}