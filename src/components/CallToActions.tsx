"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Users, 
  Download, 
  ArrowRight,
  Sparkles,
  Share2,
  FileText
} from "lucide-react";

interface CallToActionsProps {
  onStartManaging?: () => void;
  onInviteFamily?: () => void;
  onExportReport?: () => void;
}

export function CallToActions({ onStartManaging, onInviteFamily, onExportReport }: CallToActionsProps) {
  return (
    <div className="space-y-6">
      {/* Primary CTA */}
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to Take Control?</h3>
              <p className="text-blue-100 mb-4">
                Start managing your documents with AI-powered insights and never miss a renewal deadline again.
              </p>
              <Button 
                onClick={onStartManaging}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Start Managing Your Documents
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-blue-200 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary CTAs */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onInviteFamily}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              Invite Family Member
            </CardTitle>
            <CardDescription>
              Add spouse or children to track their documents together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Family Member
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onExportReport}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Download className="h-5 w-5 mr-2 text-blue-600" />
              Export Report
            </CardTitle>
            <CardDescription>
              Generate a comprehensive document status report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-1">
              <Plus className="h-4 w-4" />
              <span className="text-xs">Add Document</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-1">
              <Share2 className="h-4 w-4" />
              <span className="text-xs">Share Status</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-1">
              <FileText className="h-4 w-4" />
              <span className="text-xs">View Timeline</span>
            </Button>
            <Button variant="outline" size="sm" className="h-auto p-3 flex flex-col items-center space-y-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Family View</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
