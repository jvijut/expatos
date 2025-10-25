"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Health Score Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts Skeleton */}
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded-lg"></div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Timeline Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>

      {/* Action Plan Skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48"></div>
        <div className="h-40 bg-gray-200 rounded-lg"></div>
        <div className="h-40 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}
