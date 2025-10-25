"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Plus
} from "lucide-react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { DocumentSearch } from "@/components/DocumentSearch";
import { DependencyMap } from "@/components/DependencyMap";
import { FamilyManagement } from "@/components/FamilyManagement";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for demonstration
  const criticalAlerts = [
    {
      id: 1,
      type: "CRITICAL",
      title: "Passport Expiry Warning",
      message: "Your passport expires in 5 months. UAE visa renewal requires 6+ months validity.",
      daysLeft: 30,
      document: "Passport"
    },
    {
      id: 2,
      type: "HIGH",
      title: "Visa Renewal Due",
      message: "Your UAE visa expires in 90 days. Start renewal process now.",
      daysLeft: 90,
      document: "UAE Visa"
    }
  ];

  const upcomingRenewals = [
    { document: "Emirates ID", daysLeft: 45, status: "warning" },
    { document: "Ejari", daysLeft: 60, status: "warning" },
    { document: "Health Insurance", daysLeft: 120, status: "ok" },
    { document: "Driver's License", daysLeft: 200, status: "ok" }
  ];

  const documentStats = {
    total: 12,
    expiringSoon: 3,
    expired: 1,
    familyMembers: 2
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ExpatOS</h1>
                <p className="text-sm text-gray-500">AI Memory & Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <DocumentSearch />
              <DocumentUpload />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Sarah! 👋
          </h2>
          <p className="text-gray-600">
            Here's your expat document overview for today
          </p>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Critical Alerts</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {criticalAlerts.map((alert) => (
                <Card key={alert.id} className="border-red-200 bg-red-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-red-900 text-sm font-medium">
                        {alert.title}
                      </CardTitle>
                      <Badge variant="destructive" className="text-xs">
                        {alert.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-800 text-sm mb-3">{alert.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-red-700">
                        {alert.daysLeft} days left
                      </span>
                      <Button size="sm" variant="destructive">
                        Take Action
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documentStats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{documentStats.expiringSoon}</div>
                  <p className="text-xs text-muted-foreground">
                    Next 90 days
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expired</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{documentStats.expired}</div>
                  <p className="text-xs text-muted-foreground">
                    Requires immediate action
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Family Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{documentStats.familyMembers}</div>
                  <p className="text-xs text-muted-foreground">
                    Documents tracked
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Renewals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Renewals
                </CardTitle>
                <CardDescription>
                  Documents that need attention in the next 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingRenewals.map((renewal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className={`h-2 w-2 rounded-full ${
                          renewal.status === 'ok' ? 'bg-green-500' : 'bg-orange-500'
                        }`} />
                        <span className="font-medium">{renewal.document}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">
                          {renewal.daysLeft} days
                        </span>
                        <Badge variant={renewal.status === 'ok' ? 'secondary' : 'destructive'}>
                          {renewal.status === 'ok' ? 'OK' : 'Action Needed'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Library</CardTitle>
                <CardDescription>
                  All your important documents organized by type and country
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                  <p className="text-gray-600 mb-4">
                    Upload your first document to get started with AI-powered organization
                  </p>
                  <DocumentUpload />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <DependencyMap documents={[]} dependencies={[]} />
          </TabsContent>

          <TabsContent value="family">
            <FamilyManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
