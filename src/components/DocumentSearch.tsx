"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Calendar, MapPin, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  country: string;
  expiryDate?: string;
  description?: string;
  relevance: number;
  matchedFields: string[];
}

interface DocumentSearchProps {
  onSearchComplete?: (results: SearchResult[]) => void;
}

export function DocumentSearch({ onSearchComplete }: DocumentSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  // Mock search results for demonstration
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Passport - John Smith",
      type: "PASSPORT",
      country: "USA",
      expiryDate: "2025-05-15",
      description: "US Passport issued in 2020",
      relevance: 95,
      matchedFields: ["title", "type"]
    },
    {
      id: "2", 
      title: "UAE Visa",
      type: "VISA",
      country: "UAE",
      expiryDate: "2024-12-20",
      description: "Employment visa for Dubai",
      relevance: 88,
      matchedFields: ["type", "country"]
    },
    {
      id: "3",
      title: "Emirates ID",
      type: "EMIRATES_ID",
      country: "UAE", 
      expiryDate: "2025-03-10",
      description: "Emirates ID card",
      relevance: 82,
      matchedFields: ["type"]
    }
  ];

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);
    
    try {
      // Simulate AI search processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter mock results based on query
      const filteredResults = mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.type.toLowerCase().includes(query.toLowerCase()) ||
        result.country.toLowerCase().includes(query.toLowerCase()) ||
        result.description?.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filteredResults);
      onSearchComplete?.(filteredResults);
      
      if (filteredResults.length === 0) {
        toast.info("No documents found matching your search");
      } else {
        toast.success(`Found ${filteredResults.length} document(s)`);
      }
      
    } catch (error) {
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      PASSPORT: "bg-blue-100 text-blue-800",
      VISA: "bg-green-100 text-green-800", 
      EMIRATES_ID: "bg-purple-100 text-purple-800",
      DRIVERS_LICENSE: "bg-orange-100 text-orange-800",
      EJARI: "bg-red-100 text-red-800",
      HEALTH_INSURANCE: "bg-teal-100 text-teal-800",
      OTHER: "bg-gray-100 text-gray-800"
    };
    return colors[type] || colors.OTHER;
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Search Documents
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
            AI Document Search
          </DialogTitle>
          <DialogDescription>
            Search your documents using natural language. Try queries like "passport expiring soon" or "UAE visa documents".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Input */}
          <div className="flex space-x-3">
            <div className="flex-1">
              <Input
                placeholder="Search documents... (e.g., 'passport expiring soon', 'UAE visa', 'documents for renewal')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-base"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !query.trim()}
              className="min-w-[120px]"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Search Results</h3>
                <Badge variant="secondary">{results.length} found</Badge>
              </div>
              
              <div className="space-y-3">
                {results.map((result) => {
                  const daysLeft = result.expiryDate ? getDaysUntilExpiry(result.expiryDate) : null;
                  const isExpiringSoon = daysLeft !== null && daysLeft <= 90;
                  const isExpired = daysLeft !== null && daysLeft <= 0;
                  
                  return (
                    <Card key={result.id} className={`transition-all hover:shadow-md ${
                      isExpired ? 'border-red-200 bg-red-50' : 
                      isExpiringSoon ? 'border-orange-200 bg-orange-50' : 
                      'border-gray-200'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-600" />
                              <h4 className="font-medium text-gray-900">{result.title}</h4>
                              <Badge className={getDocumentTypeColor(result.type)}>
                                {result.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            {result.description && (
                              <p className="text-sm text-gray-600">{result.description}</p>
                            )}
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{result.country}</span>
                              </div>
                              
                              {result.expiryDate && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>Expires: {formatDate(result.expiryDate)}</span>
                                  {daysLeft !== null && (
                                    <Badge 
                                      variant={isExpired ? 'destructive' : isExpiringSoon ? 'destructive' : 'secondary'}
                                      className="ml-2"
                                    >
                                      {isExpired ? 'Expired' : `${daysLeft} days left`}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {result.relevance}% match
                              </div>
                              <div className="text-xs text-gray-500">
                                AI relevance score
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Tips */}
          {results.length === 0 && !isSearching && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Search Tips</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Try "passport expiring soon" to find passports that need renewal</li>
                  <li>• Search "UAE documents" to find all UAE-related documents</li>
                  <li>• Use "visa renewal" to find documents needed for visa processes</li>
                  <li>• Search by document number or specific details</li>
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
