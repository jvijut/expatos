"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  XCircle,
  Plane,
  MapPin,
  Shield,
  Home,
  Settings,
  Bell,
  Menu,
  UserPlus,
  Edit,
  Trash2,
  Baby,
  Heart,
  Download
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

// Document type definition
interface Document {
  id: string;
  type: string;
  number: string;
  holderName: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  status: string;
  fileName?: string;
  fileSize?: number;
  title?: string;
  description?: string;
  country?: string;
  documentNumber?: string;
}

// Family member type definition
interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  nationality: string;
  documents: Document[];
  avatar?: string;
}

// User profile type definition
interface UserProfile {
  id: string;
  name: string;
  email: string;
  nationality: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  emergencyContact: string;
  avatar?: string;
}

// Helper function to get document emoji
const getDocumentEmoji = (type: string) => {
  const emojis: Record<string, string> = {
    'passport': '🛂',
    'uae_visa': '📋',
    'emirates_id': '🆔',
    'ejari': '🏠',
    'health_insurance': '🏥',
    'drivers_license': '🚗',
    'labor_card': '💼',
    'bank_statement': '🏦',
    'tax_document': '📊',
    'birth_certificate': '👶',
    'marriage_certificate': '💍'
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
    'health_insurance': 'Health Insurance',
    'drivers_license': "Driver's License",
    'labor_card': 'Labor Card',
    'bank_statement': 'Bank Statement',
    'tax_document': 'Tax Document',
    'birth_certificate': 'Birth Certificate',
    'marriage_certificate': 'Marriage Certificate'
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
const getDocumentStatus = (doc: Document) => {
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

// Professional Navigation Component
function ProfessionalNav({ activeSection, setActiveSection, notifications, unreadCount, showNotifications, setShowNotifications, handleMarkAsRead, handleMarkAllAsRead }: { 
  activeSection: string, 
  setActiveSection: (section: string) => void,
  notifications: any[],
  unreadCount: number,
  showNotifications: boolean,
  setShowNotifications: (show: boolean) => void,
  handleMarkAsRead: (id: string) => void,
  handleMarkAllAsRead: () => void
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'documents', label: 'Your Documents', icon: FileText },
    { id: 'travel', label: 'Travel Planning', icon: Plane },
    { id: 'visa', label: 'Visa Tracking', icon: Shield },
    { id: 'family', label: 'Family Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ExpatOS</h1>
                <p className="text-sm text-gray-500">AI Memory & Assistant</p>
              </div>
            </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    activeSection === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
            </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleMarkAllAsRead}
                          className="text-xs"
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.severity === 'critical' ? 'bg-red-500' :
                              notification.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.description}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">John Smith</p>
                <p className="text-xs text-gray-500">Global Citizen</p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                  JS
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Documents Section Component
function DocumentsSection({ documents, onDocumentUpload, onEditDocument, onDeleteDocument, onDemoUpload }: { 
  documents: Document[], 
  onDocumentUpload: (doc: Document) => void,
  onEditDocument: (id: string, doc: Document) => void,
  onDeleteDocument: (id: string) => void,
  onDemoUpload: () => void
}) {
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    type: '',
    country: '',
    expiryDate: '',
    documentNumber: ''
  });

  const handleEdit = (doc: Document) => {
    setEditingDoc(doc);
    setEditFormData({
      title: doc.title || getDocumentTypeName(doc.type),
      type: doc.type,
      country: doc.country || 'USA',
      expiryDate: doc.expiryDate,
      documentNumber: doc.documentNumber || doc.number
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;

    const updatedDoc: Document = {
      ...editingDoc,
      title: editFormData.title,
      type: editFormData.type,
      country: editFormData.country,
      expiryDate: editFormData.expiryDate,
      documentNumber: editFormData.documentNumber,
      number: editFormData.documentNumber
    };

    onEditDocument(editingDoc.id, updatedDoc);
    setShowEditForm(false);
    setEditingDoc(null);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Documents</h2>
          <p className="text-gray-600">Manage and organize your important documents</p>
        </div>
            <DocumentUpload onUploadComplete={onDocumentUpload} onDemoUpload={onDemoUpload} />
        </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
            </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Types</option>
            <option value="passport">Passport</option>
            <option value="uae_visa">UAE Visa</option>
            <option value="emirates_id">Emirates ID</option>
            <option value="ejari">Ejari</option>
            <option value="health_insurance">Health Insurance</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Status</option>
            <option value="valid">Valid</option>
            <option value="warning">Warning</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Edit Document Form */}
      {showEditForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Edit className="h-5 w-5 mr-2" />
              Edit Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Document Type *</label>
                  <select
                    required
                    value={editFormData.type}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="passport">Passport</option>
                    <option value="uae_visa">UAE Visa</option>
                    <option value="emirates_id">Emirates ID</option>
                    <option value="ejari">Ejari</option>
                    <option value="health_insurance">Health Insurance</option>
                    <option value="drivers_license">Driver's License</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Country *</label>
                  <select
                    required
                    value={editFormData.country}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USA">United States</option>
                    <option value="UAE">United Arab Emirates</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={editFormData.expiryDate}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Document Number *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.documentNumber}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, documentNumber: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingDoc(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Update Document
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Document Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => {
          const status = getDocumentStatus(doc);
          const daysLeft = getDaysUntilExpiry(doc.expiryDate);
          const statusBadge = getStatusBadge(status);
          
          return (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getDocumentEmoji(doc.type)}</span>
                    <div>
                      <CardTitle className="text-sm font-medium">
                        {getDocumentTypeName(doc.type)}
                      </CardTitle>
                      <p className="text-xs text-gray-500">{doc.issuingAuthority}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={statusBadge.variant}
                      className={statusBadge.className}
                    >
                      {statusBadge.text}
                      </Badge>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(doc)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteDocument(doc.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Number:</span>
                    <span className="font-mono">{doc.number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expires:</span>
                    <span>{new Date(doc.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Days Left:</span>
                    <span className={daysLeft <= 30 ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                      {daysLeft <= 0 ? 'Expired' : `${daysLeft} days`}
                      </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Travel Planning Section Component
function TravelPlanningSection() {
  const [trips, setTrips] = useState([
    {
      id: '1',
      destination: 'London, UK',
      startDate: '2024-12-15',
      endDate: '2024-12-22',
      visaRequired: true,
      status: 'planned',
      flights: [
        {
          id: 'f1',
          airline: 'Emirates',
          flightNumber: 'EK001',
          departure: '2024-12-15T08:00:00',
          arrival: '2024-12-15T12:30:00',
          from: 'DXB',
          to: 'LHR',
          price: 1200
        },
        {
          id: 'f2',
          airline: 'Emirates',
          flightNumber: 'EK002',
          departure: '2024-12-22T14:00:00',
          arrival: '2024-12-22T22:30:00',
          from: 'LHR',
          to: 'DXB',
          price: 1200
        }
      ]
    },
    {
      id: '2',
      destination: 'New York, USA',
      startDate: '2025-01-20',
      endDate: '2025-01-25',
      visaRequired: false,
      status: 'planned',
      flights: [
        {
          id: 'f3',
          airline: 'Etihad',
          flightNumber: 'EY101',
          departure: '2025-01-20T10:00:00',
          arrival: '2025-01-20T18:00:00',
          from: 'DXB',
          to: 'JFK',
          price: 1500
        }
      ]
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [editingFlight, setEditingFlight] = useState<any>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [tripFormData, setTripFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    visaRequired: false
  });
  const [flightFormData, setFlightFormData] = useState({
    airline: '',
    flightNumber: '',
    departure: '',
    arrival: '',
    from: '',
    to: '',
    price: 0
  });

  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrip = {
      id: Date.now().toString(),
      ...tripFormData,
      status: 'planned',
      flights: []
    };
    setTrips(prev => [...prev, newTrip]);
    setTripFormData({ destination: '', startDate: '', endDate: '', visaRequired: false });
    setShowAddForm(false);
  };

  const handleEditTrip = (trip: any) => {
    setEditingTrip(trip);
    setTripFormData({
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      visaRequired: trip.visaRequired
    });
    setShowAddForm(true);
  };

  const handleUpdateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTrip = {
      ...editingTrip,
      ...tripFormData
    };
    setTrips(prev => prev.map(trip => trip.id === editingTrip.id ? updatedTrip : trip));
    setShowAddForm(false);
    setEditingTrip(null);
    setTripFormData({ destination: '', startDate: '', endDate: '', visaRequired: false });
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
  };

  const handleAddFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId) return;
    
    const newFlight = {
      id: 'f' + Date.now(),
      ...flightFormData,
      price: parseInt(flightFormData.price.toString())
    };
    
    setTrips(prev => prev.map(trip => 
      trip.id === selectedTripId 
        ? { ...trip, flights: [...trip.flights, newFlight] }
        : trip
    ));
    
    setFlightFormData({
      airline: '',
      flightNumber: '',
      departure: '',
      arrival: '',
      from: '',
      to: '',
      price: 0
    });
    setShowFlightForm(false);
    setSelectedTripId(null);
  };

  const handleEditFlight = (tripId: string, flight: any) => {
    setEditingFlight(flight);
    setSelectedTripId(tripId);
    setFlightFormData({
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      departure: flight.departure,
      arrival: flight.arrival,
      from: flight.from,
      to: flight.to,
      price: flight.price
    });
    setShowFlightForm(true);
  };

  const handleUpdateFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId || !editingFlight) return;
    
    const updatedFlight = {
      ...editingFlight,
      ...flightFormData,
      price: parseInt(flightFormData.price.toString())
    };
    
    setTrips(prev => prev.map(trip => 
      trip.id === selectedTripId 
        ? { 
            ...trip, 
            flights: trip.flights.map(flight => 
              flight.id === editingFlight.id ? updatedFlight : flight
            )
          }
        : trip
    ));
    
    setShowFlightForm(false);
    setEditingFlight(null);
    setSelectedTripId(null);
    setFlightFormData({
      airline: '',
      flightNumber: '',
      departure: '',
      arrival: '',
      from: '',
      to: '',
      price: 0
    });
  };

  const handleDeleteFlight = (tripId: string, flightId: string) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { ...trip, flights: trip.flights.filter(flight => flight.id !== flightId) }
        : trip
    ));
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Travel Planning</h2>
          <p className="text-gray-600">Plan your travels with visa requirements and flight management</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Trip
                      </Button>
                    </div>

      {/* Add/Edit Trip Form */}
      {showAddForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Plane className="h-5 w-5 mr-2" />
              {editingTrip ? 'Edit Trip' : 'Add New Trip'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingTrip ? handleUpdateTrip : handleAddTrip} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Destination *</label>
                  <input
                    type="text"
                    required
                    value={tripFormData.destination}
                    onChange={(e) => setTripFormData(prev => ({ ...prev, destination: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., London, UK"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={tripFormData.startDate}
                    onChange={(e) => setTripFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">End Date *</label>
                  <input
                    type="date"
                    required
                    value={tripFormData.endDate}
                    onChange={(e) => setTripFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="visaRequired"
                    checked={tripFormData.visaRequired}
                    onChange={(e) => setTripFormData(prev => ({ ...prev, visaRequired: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="visaRequired" className="text-sm font-medium text-gray-700">
                    Visa Required
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTrip(null);
                    setTripFormData({ destination: '', startDate: '', endDate: '', visaRequired: false });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editingTrip ? 'Update Trip' : 'Add Trip'}
                </Button>
              </div>
            </form>
                  </CardContent>
                </Card>
      )}

      {/* Add/Edit Flight Form */}
      {showFlightForm && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-900">
              <Plane className="h-5 w-5 mr-2" />
              {editingFlight ? 'Edit Flight' : 'Add New Flight'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingFlight ? handleUpdateFlight : handleAddFlight} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Airline *</label>
                  <input
                    type="text"
                    required
                    value={flightFormData.airline}
                    onChange={(e) => setFlightFormData(prev => ({ ...prev, airline: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Emirates"
                  />
            </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Flight Number *</label>
                  <input
                    type="text"
                    required
                    value={flightFormData.flightNumber}
                    onChange={(e) => setFlightFormData(prev => ({ ...prev, flightNumber: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., EK001"
                  />
          </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Departure Airport *</label>
                  <input
                    type="text"
                    required
                    value={flightFormData.from}
                    onChange={(e) => setFlightFormData(prev => ({ ...prev, from: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., DXB"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Arrival Airport *</label>
                  <input
                    type="text"
                    required
                    value={flightFormData.to}
                    onChange={(e) => setFlightFormData(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., LHR"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Departure Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={flightFormData.departure}
                    onChange={(e) => setFlightFormData(prev => ({ ...prev, departure: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Arrival Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={flightFormData.arrival}
                    onChange={(e) => setFlightFormData(prev => ({ ...prev, arrival: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    value={flightFormData.price}
                    onChange={(e) => setFlightFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowFlightForm(false);
                    setEditingFlight(null);
                    setSelectedTripId(null);
                    setFlightFormData({
                      airline: '',
                      flightNumber: '',
                      departure: '',
                      arrival: '',
                      from: '',
                      to: '',
                      price: 0
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  {editingFlight ? 'Update Flight' : 'Add Flight'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Trips and Flights */}
      <div className="space-y-6">
        {trips.map((trip) => (
          <Card key={trip.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {trip.destination}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={trip.visaRequired ? "secondary" : "outline"}>
                    {trip.visaRequired ? 'Visa Required' : 'Visa Free'}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTrip(trip)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setShowFlightForm(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </p>
                </CardHeader>
                <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Flights ({trip.flights.length})</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTripId(trip.id);
                      setShowFlightForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Flight
                  </Button>
                </div>
                
                {trip.flights.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No flights added yet. Click "Add Flight" to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trip.flights.map((flight) => (
                      <div key={flight.id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h5 className="font-medium">{flight.airline} {flight.flightNumber}</h5>
                              <p className="text-sm text-gray-600">
                                {flight.from} → {flight.to}
                              </p>
                            </div>
                            <div className="text-sm">
                              <p className="font-medium">Departure</p>
                              <p className="text-gray-600">{formatDateTime(flight.departure)}</p>
                            </div>
                            <div className="text-sm">
                              <p className="font-medium">Arrival</p>
                              <p className="text-gray-600">{formatDateTime(flight.arrival)}</p>
                            </div>
                            <div className="text-sm">
                              <p className="font-medium">Price</p>
                              <p className="text-gray-600">${flight.price}</p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditFlight(trip.id, flight)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFlight(trip.id, flight.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
                </CardContent>
              </Card>
        ))}
      </div>

      {/* Visa Requirements */}
              <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Visa Requirements
          </CardTitle>
                </CardHeader>
                <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">🇬🇧 United Kingdom</h4>
              <p className="text-sm text-gray-600 mb-2">Visa required for US citizens</p>
              <div className="text-xs text-gray-500">
                <p>• Processing time: 15-30 days</p>
                <p>• Cost: $150-200</p>
                <p>• Valid for: 6 months</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">🇺🇸 United States</h4>
              <p className="text-sm text-gray-600 mb-2">Visa-free for US citizens</p>
              <div className="text-xs text-gray-500">
                <p>• Stay duration: 90 days</p>
                <p>• Passport validity: 6 months</p>
                <p>• No visa required</p>
              </div>
            </div>
          </div>
                </CardContent>
              </Card>
    </div>
  );
}

// Family Management Section Component
function FamilyManagementSection({ familyMembers, onAddFamilyMember, onUpdateFamilyMember, onDeleteFamilyMember }: {
  familyMembers: FamilyMember[];
  onAddFamilyMember: (member: FamilyMember) => void;
  onUpdateFamilyMember: (id: string, member: FamilyMember) => void;
  onDeleteFamilyMember: (id: string) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    dateOfBirth: '',
    nationality: ''
  });

  const relationships = [
    'Spouse', 'Child', 'Parent', 'Sibling', 'Other'
  ];

  const nationalities = [
    'USA', 'UAE', 'UK', 'Canada', 'Australia', 'India', 'Pakistan', 'Philippines', 'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const member: FamilyMember = {
      id: editingMember?.id || Date.now().toString(),
      name: formData.name,
      relationship: formData.relationship,
      dateOfBirth: formData.dateOfBirth,
      nationality: formData.nationality,
      documents: editingMember?.documents || []
    };

    if (editingMember) {
      onUpdateFamilyMember(editingMember.id, member);
    } else {
      onAddFamilyMember(member);
    }

    // Reset form
    setFormData({ name: '', relationship: '', dateOfBirth: '', nationality: '' });
    setShowAddForm(false);
    setEditingMember(null);
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      relationship: member.relationship,
      dateOfBirth: member.dateOfBirth,
      nationality: member.nationality
    });
    setShowAddForm(true);
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case 'spouse': return <Heart className="h-4 w-4 text-pink-500" />;
      case 'child': return <Baby className="h-4 w-4 text-blue-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Family Management</h2>
          <p className="text-gray-600">Manage documents for your family members</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Family Member
        </Button>
      </div>

      {/* Add/Edit Family Member Form */}
      {showAddForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <UserPlus className="h-5 w-5 mr-2" />
              {editingMember ? 'Edit Family Member' : 'Add New Family Member'}
            </CardTitle>
                </CardHeader>
                <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Relationship *</label>
                  <select
                    required
                    value={formData.relationship}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select relationship</option>
                    {relationships.map(rel => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nationality *</label>
                  <select
                    required
                    value={formData.nationality}
                    onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select nationality</option>
                    {nationalities.map(nat => (
                      <option key={nat} value={nat}>{nat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingMember(null);
                    setFormData({ name: '', relationship: '', dateOfBirth: '', nationality: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editingMember ? 'Update Member' : 'Add Member'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Family Members Grid */}
      {familyMembers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Family Members Added</h3>
            <p className="text-gray-600 mb-4">
              Add your family members to manage their documents and visa requirements.
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Your First Family Member
            </Button>
                </CardContent>
              </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {familyMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        {getRelationshipIcon(member.relationship)}
                        <span>{member.relationship}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteFamilyMember(member.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date of Birth:</span>
                    <span>{new Date(member.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nationality:</span>
                    <span>{member.nationality}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Documents:</span>
                    <Badge variant="secondary">
                      {member.documents.length} documents
                    </Badge>
                  </div>
                  
                  {/* Document Status Summary */}
                  {member.documents.length > 0 && (
                    <div className="pt-3 border-t">
                      <div className="text-xs text-gray-600 mb-2">Document Status:</div>
                      <div className="flex space-x-2">
                        {member.documents.slice(0, 3).map((doc) => {
                          const status = getDocumentStatus(doc);
                          return (
                            <div key={doc.id} className="flex items-center space-x-1">
                              <span className="text-lg">{getDocumentEmoji(doc.type)}</span>
                              <div className={`w-2 h-2 rounded-full ${
                                status === 'valid' ? 'bg-green-500' :
                                status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                            </div>
                          );
                        })}
                        {member.documents.length > 3 && (
                          <span className="text-xs text-gray-500">+{member.documents.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Family Statistics */}
      {familyMembers.length > 0 && (
              <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Family Overview
            </CardTitle>
                </CardHeader>
                <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{familyMembers.length}</div>
                <div className="text-sm text-gray-600">Total Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {familyMembers.filter(m => m.documents.length > 0).length}
                </div>
                <div className="text-sm text-gray-600">With Documents</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {familyMembers.filter(m => m.relationship === 'Spouse').length}
                </div>
                <div className="text-sm text-gray-600">Spouses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {familyMembers.filter(m => m.relationship === 'Child').length}
                </div>
                <div className="text-sm text-gray-600">Children</div>
              </div>
            </div>
                </CardContent>
              </Card>
      )}
            </div>
  );
}

// Visa Tracking Section Component
function VisaTrackingSection() {
  const [visaInfo, setVisaInfo] = useState({
    type: 'UAE Residence Visa',
    expiryDate: '2025-12-01',
    status: 'Active',
    estimatedCost: 1200,
    renewalDays: 90
  });
  
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    type: visaInfo.type,
    expiryDate: visaInfo.expiryDate,
    estimatedCost: visaInfo.estimatedCost,
    renewalDays: visaInfo.renewalDays
  });

  const handleUpdateVisa = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedVisa = {
      ...visaInfo,
      ...formData
    };
    setVisaInfo(updatedVisa);
    setShowEditForm(false);
  };

  const calculateDaysLeft = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateMonthsLeft = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visa Tracking</h2>
          <p className="text-gray-600">Monitor your visa status and renewal timelines</p>
        </div>
        <Button 
          onClick={() => setShowEditForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Visa Info
        </Button>
      </div>

      {/* Edit Visa Form */}
      {showEditForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Shield className="h-5 w-5 mr-2" />
              Edit Visa Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateVisa} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Visa Type *</label>
                  <input
                    type="text"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estimated Renewal Cost ($)</label>
                  <input
                    type="number"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: parseInt(e.target.value) }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Days Before Renewal Alert</label>
                  <input
                    type="number"
                    value={formData.renewalDays}
                    onChange={(e) => setFormData(prev => ({ ...prev, renewalDays: parseInt(e.target.value) }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Update Visa Info
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {/* Current Visa Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Current Visa Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-900">{visaInfo.type}</h4>
                    <p className="text-sm text-green-700">Valid until {new Date(visaInfo.expiryDate).toLocaleDateString()}</p>
                      </div>
                      </div>
                <Badge className="bg-green-600 text-white">{visaInfo.status}</Badge>
                    </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{calculateMonthsLeft(visaInfo.expiryDate)}</div>
                  <div className="text-sm text-gray-600">Months Left</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{visaInfo.renewalDays}</div>
                  <div className="text-sm text-gray-600">Days to Renewal Alert</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">${visaInfo.estimatedCost}</div>
                  <div className="text-sm text-gray-600">Estimated Cost</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Renewal Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Renewal Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-semibold">Start Renewal Process</h4>
                  <p className="text-sm text-gray-600">Begin 90 days before expiry</p>
                  <Badge variant="secondary" className="mt-1">Sep 1, 2025</Badge>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-semibold">Submit Documents</h4>
                  <p className="text-sm text-gray-600">Gather and submit all required documents</p>
                  <Badge variant="secondary" className="mt-1">Sep 15, 2025</Badge>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <h4 className="font-semibold">Visa Approved</h4>
                  <p className="text-sm text-gray-600">Receive renewed visa</p>
                  <Badge variant="secondary" className="mt-1">Oct 1, 2025</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Settings Section Component
function SettingsSection({ userProfile, onUpdateProfile }: {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    nationality: userProfile.nationality,
    dateOfBirth: userProfile.dateOfBirth,
    phoneNumber: userProfile.phoneNumber,
    address: userProfile.address,
    emergencyContact: userProfile.emergencyContact
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: UserProfile = {
      ...userProfile,
      ...formData
    };
    onUpdateProfile(updatedProfile);
    setIsEditing(false);
  };

  const nationalities = [
    'USA', 'UAE', 'UK', 'Canada', 'Australia', 'India', 'Pakistan', 'Philippines', 'Other'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nationality *</label>
                  <select
                    required
                    value={formData.nationality}
                    onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {nationalities.map(nat => (
                      <option key={nat} value={nat}>{nat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-gray-900">{userProfile.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{userProfile.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nationality</label>
                  <p className="text-gray-900">{userProfile.nationality}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="text-gray-900">{new Date(userProfile.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="text-gray-900">{userProfile.phoneNumber || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                  <p className="text-gray-900">{userProfile.emergencyContact || 'Not provided'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <p className="text-gray-900">{userProfile.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
              </CardContent>
            </Card>

      {/* Account Settings */}
            <Card>
              <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications & Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive alerts about document renewals</p>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">SMS Alerts</h4>
                <p className="text-sm text-gray-600">Get urgent notifications via SMS</p>
              </div>
              <Button variant="outline" size="sm">Disabled</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Weekly Reports</h4>
                <p className="text-sm text-gray-600">Receive weekly document status updates</p>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Export Documents</h4>
                <p className="text-sm text-gray-600">Download all your documents as a ZIP file</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Generate Report</h4>
                <p className="text-sm text-gray-600">Create a comprehensive document status report</p>
              </div>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    nationality: 'USA',
    dateOfBirth: '1985-06-15',
    phoneNumber: '+971 50 123 4567',
    address: 'Dubai Marina, UAE',
    emergencyContact: 'Sarah Smith (+1 555 123 4567)'
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Simulate AI analysis
    const performAnalysis = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = analyzeDependencies(documents);
      setAnalysis(result);
      setIsLoading(false);
    };

    performAnalysis();
  }, [documents]);

  // Generate notifications from alerts
  useEffect(() => {
    if (analysis?.criticalAlerts) {
      const newNotifications = analysis.criticalAlerts.map((alert: any, index: number) => ({
        id: `notif-${index}`,
        title: alert.title,
        description: alert.description,
        severity: alert.severity,
        timestamp: new Date().toISOString(),
        read: false
      }));
      setNotifications(newNotifications);
    }
  }, [analysis]);

  // Calculate statistics
  const totalDocuments = documents.length;
  const validDocuments = documents.filter(doc => getDocumentStatus(doc) === 'valid').length;
  const expiringSoon = documents.filter(doc => {
    const status = getDocumentStatus(doc);
    return status === 'warning';
  }).length;
  const criticalIssues = documents.filter(doc => {
    const status = getDocumentStatus(doc);
    return status === 'expired';
  }).length;

  const criticalAlerts = analysis?.criticalAlerts?.filter((alert: any) => 
    alert.severity === 'critical' || alert.severity === 'warning'
  ) || [];

  // Handle document upload
  const handleDocumentUpload = (newDoc: any) => {
    const document: Document = {
      id: newDoc.id || Date.now().toString(),
      type: newDoc.type,
      number: newDoc.documentNumber || `DOC-${Date.now()}`,
      holderName: 'John Smith',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: newDoc.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      issuingAuthority: `${newDoc.country} Government`,
      status: 'valid',
      fileName: newDoc.fileName,
      fileSize: newDoc.fileSize,
      title: newDoc.title,
      description: newDoc.description,
      country: newDoc.country,
      documentNumber: newDoc.documentNumber
    };
    
    setDocuments(prev => [...prev, document]);
  };

  // Handle demo upload - fixes critical issues
  const handleDemoUpload = () => {
    // Create new passport document that fixes the dependency issue
    const newPassport: Document = {
      id: 'demo-passport-' + Date.now(),
      type: 'passport',
      number: 'N9876543',
      holderName: 'John Smith',
      issueDate: '2024-03-15',
      expiryDate: '2030-03-15', // This fixes the dependency issue!
      issuingAuthority: 'US Department of State',
      status: 'valid',
      fileName: 'passport_renewed_2024.pdf',
      fileSize: 2048576,
      title: 'US Passport - John Smith',
      description: 'Renewed US Passport with extended validity',
      country: 'USA',
      documentNumber: 'N9876543'
    };

    // Replace the old passport with the new one
    setDocuments(prev => prev.map(doc => 
      doc.type === 'passport' ? newPassport : doc
    ));
  };

  // Handle family member operations
  const handleAddFamilyMember = (member: FamilyMember) => {
    setFamilyMembers(prev => [...prev, member]);
  };

  const handleUpdateFamilyMember = (id: string, updatedMember: FamilyMember) => {
    setFamilyMembers(prev => prev.map(member => 
      member.id === id ? updatedMember : member
    ));
  };

  const handleDeleteFamilyMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
  };

  // Handle document operations
  const handleEditDocument = (id: string, updatedDoc: Document) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? updatedDoc : doc
    ));
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Handle user profile operations
  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  // Handle notifications
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Demo Mode Banner */}
      <DemoBanner />

      {/* Professional Navigation */}
      <ProfessionalNav 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        notifications={notifications}
        unreadCount={unreadCount}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        handleMarkAsRead={handleMarkAsRead}
        handleMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeSection === 'dashboard' && (
          <>
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
                      <DocumentUpload 
                        onUploadComplete={handleDocumentUpload}
                        onDemoUpload={handleDemoUpload}
                      />
                    </div>
                  </div>
                </div>

                {/* Impressive Stats */}
                <div className="mb-8 animate-fade-in">
                  <ImpressiveStats />
                </div>

                {/* Health Score */}
                <div className="mb-8 animate-fade-in">
                  <HealthScore score={analysis?.healthScore || 45} />
                </div>

                {/* Stats Cards Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-fade-in">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalDocuments}</div>
                      <p className="text-xs text-muted-foreground">All document types</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Valid Documents</CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{validDocuments}</div>
                      <p className="text-xs text-muted-foreground">Up to date</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">{expiringSoon}</div>
                      <p className="text-xs text-muted-foreground">&lt;90 days</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                      <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{criticalIssues}</div>
                      <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Critical Alerts */}
                {criticalAlerts.length > 0 && (
                  <div className="mb-8 animate-fade-in">
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
                <div className="mb-8 animate-fade-in">
                  <Timeline documents={documents} />
                </div>

                {/* Dependency Graph Section */}
                <div className="mb-8 animate-fade-in">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Document Dependency Status
                    </h3>
                    <p className="text-gray-600">How your documents are connected</p>
                  </div>
                  <DependencyGraph 
                    dependencies={analysis?.dependencies || []} 
                    documents={documents} 
                  />
                </div>

                {/* Action Plan Section */}
                <div className="mb-8 animate-fade-in">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Your Renewal Checklist
                    </h3>
                    <p className="text-gray-600">Complete these tasks in order</p>
                  </div>
                  <ActionPlan 
                    dependencies={analysis?.dependencies || []} 
                    documents={documents} 
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
                          {documents.map((doc) => {
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
          </>
        )}

        {activeSection === 'documents' && (
          <DocumentsSection 
            documents={documents} 
            onDocumentUpload={handleDocumentUpload}
            onEditDocument={handleEditDocument}
            onDeleteDocument={handleDeleteDocument}
            onDemoUpload={handleDemoUpload}
          />
        )}

        {activeSection === 'travel' && (
          <TravelPlanningSection />
        )}

        {activeSection === 'visa' && (
          <VisaTrackingSection />
        )}

        {activeSection === 'family' && (
          <FamilyManagementSection 
            familyMembers={familyMembers}
            onAddFamilyMember={handleAddFamilyMember}
            onUpdateFamilyMember={handleUpdateFamilyMember}
            onDeleteFamilyMember={handleDeleteFamilyMember}
          />
        )}

        {activeSection === 'settings' && (
          <SettingsSection 
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
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