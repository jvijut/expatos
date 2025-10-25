"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Users,
  Star,
  Quote
} from "lucide-react";

export function ImpressiveStats() {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      {/* Prevented Rejections */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-900">Prevented Visa Rejections</CardTitle>
          <Shield className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">847</div>
          <p className="text-xs text-green-700 mt-1">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            +23% this month
          </p>
        </CardContent>
      </Card>

      {/* Average Savings */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900">Average Savings</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">$2,340</div>
          <p className="text-xs text-blue-700 mt-1">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            Per user annually
          </p>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-900">Active Users</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">12,847</div>
          <p className="text-xs text-purple-700 mt-1">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            Global citizens
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Dubai, UAE",
      avatar: "SJ",
      rating: 5,
      text: "ExpatOS saved me from a $3,000 visa rejection! The AI caught that my passport was expiring too soon for renewal. Absolutely essential for any expat.",
      savings: "$3,000"
    },
    {
      name: "Ahmed Hassan",
      location: "Abu Dhabi, UAE", 
      avatar: "AH",
      rating: 5,
      text: "Finally, a system that understands expat life. The dependency mapping is incredible - it shows exactly what needs to be renewed and when.",
      savings: "$1,800"
    },
    {
      name: "Maria Rodriguez",
      location: "Singapore",
      avatar: "MR", 
      rating: 5,
      text: "As a working mother with two kids, keeping track of everyone's documents was a nightmare. ExpatOS organizes everything and sends alerts before it's too late.",
      savings: "$2,500"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">What Our Users Say</h3>
        <p className="text-gray-600">Real stories from global citizens who avoided costly mistakes</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <CardTitle className="text-sm">{testimonial.name}</CardTitle>
                  <CardDescription className="text-xs">{testimonial.location}</CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Quote className="h-4 w-4 text-gray-400 mt-1" />
                  <p className="text-sm text-gray-700 italic">
                    "{testimonial.text}"
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Saved {testimonial.savings}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
