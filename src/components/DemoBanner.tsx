"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Info } from "lucide-react";

interface DemoBannerProps {
  onClose?: () => void;
}

export function DemoBanner({ onClose }: DemoBannerProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span className="font-semibold">👋 Demo Mode</span>
          </div>
          <span className="text-blue-100">
            Viewing John Smith's documents - All data is simulated for demonstration
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Interactive Demo
          </Badge>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
